package cf.budgetflow.service;

import cf.budgetflow.core.enums.TransactionType;
import cf.budgetflow.core.exceptions.EntityInvalidArgumentException;
import cf.budgetflow.core.exceptions.EntityNotFoundException;
import cf.budgetflow.dto.transaction.*;
import cf.budgetflow.filters.TransactionFilterRequestDTO;
import cf.budgetflow.mapper.Mapper;
import cf.budgetflow.model.Transaction;
import cf.budgetflow.model.User;
import cf.budgetflow.repository.TransactionRepository;
import cf.budgetflow.repository.UserRepository;
import cf.budgetflow.specifications.TransactionSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionService implements ITransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public TransactionReadDTO getTransactionById(Long id) throws EntityNotFoundException {
        User currentUser = getCurrentUser();

        Transaction transaction = findTransactionOrThrow(id);
        if (!transaction.getUser().equals(currentUser)) {
            throw new EntityNotFoundException("Transaction", "Transaction with id " + id + " not found for user " + currentUser.getUsername());
        }
        return Mapper.mapToTransactionReadDTO(transaction);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionReadDTO> getAllTransactions() throws EntityNotFoundException {
        User currentUser = getCurrentUser();
        List<Transaction> transactions = transactionRepository.findAllByUser(currentUser);
        return transactions.stream()
                .map(Mapper::mapToTransactionReadDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = {Exception.class})
    public TransactionReadDTO createTransaction(TransactionCreateDTO dto) throws EntityNotFoundException {
        User user = getCurrentUser();

        Transaction transaction = Mapper.mapToTransaction(dto);
        user.addTransaction(transaction);
        Transaction saved = transactionRepository.save(transaction);
        return Mapper.mapToTransactionReadDTO(saved);
    }

    @Override
    @Transactional(rollbackFor = {Exception.class})
    public TransactionReadDTO updateTransaction(TransactionUpdateDTO dto) throws EntityNotFoundException {
        Transaction transaction = findTransactionOrThrow(dto.id());

        User currentUser = getCurrentUser();
        if (!transaction.getUser().getId().equals(currentUser.getId())) {
            throw new EntityNotFoundException("Transaction", "Transaction with id " + dto.id()
                    + " not found for user " + currentUser.getUsername());
        }

        Mapper.updateTransactionFromDTO(dto, transaction);
        Transaction updated = transactionRepository.save(transaction);
        return Mapper.mapToTransactionReadDTO(updated);
    }

    @Override
    @Transactional(rollbackFor = {Exception.class})
    public void deleteTransaction(Long id) throws EntityNotFoundException {

        Transaction transaction = findTransactionOrThrow(id);
        User currentUser = getCurrentUser();
        if (!transaction.getUser().getId().equals(currentUser.getId())) {
            throw new EntityNotFoundException("Transaction", "Transaction with id " + id +
                    " not found for user " + currentUser.getUsername());
        }
        User user = transaction.getUser();
        user.removeTransaction(transaction);
        transactionRepository.delete(transaction);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionReadDTO> filterTransactions(TransactionFilterRequestDTO dto)
            throws EntityNotFoundException {


        User currentUser = getCurrentUser();

        Specification<Transaction> specification =
                TransactionSpecifications.belongsToUser(currentUser.getId())
                .and(TransactionSpecifications.hasType(dto.getType()))
                .and(TransactionSpecifications.hasCategory(dto.getCategory()))
                .and(TransactionSpecifications.hasMethod(dto.getPaymentMethod()))
                .and(TransactionSpecifications.dateBetween(dto.getFromDate(), dto.getToDate()))
                .and(TransactionSpecifications.amountBetween(dto.getMinAmount(), dto.getMaxAmount()));

        return transactionRepository.findAll(specification).stream()
                .map(Mapper::mapToTransactionReadDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionSummaryDTO getSummary() throws EntityNotFoundException {

        User currentUser = getCurrentUser();
        BigDecimal income = transactionRepository.getTotalIncome(currentUser.getUsername());
        BigDecimal expense = transactionRepository.getTotalExpense(currentUser.getUsername());
        Long count = transactionRepository.getTotalTransactionCount(currentUser.getUsername());
        return new TransactionSummaryDTO(income, expense, income.subtract(expense), count);
    }

    @Override
    @Transactional(readOnly = true)
        public Map<String, BigDecimal> getMonthlyTotalByType(String type) throws EntityNotFoundException, EntityInvalidArgumentException {

        TransactionType transactionType;
        try {
            transactionType = TransactionType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new EntityInvalidArgumentException("Type", "Invalid transaction type: " + type);
        }

        User currentUser = getCurrentUser();

        List<Transaction> transactions = transactionRepository.findByUserAndType(currentUser, transactionType);

        Map<Integer, BigDecimal> groupedByMonth = transactions.stream()
                .filter(t -> t.getType() == transactionType)
                .collect(Collectors.groupingBy(
                        t -> t.getDate().getMonthValue(),
                        Collectors.mapping(Transaction::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));

        Map<String, BigDecimal> result = new LinkedHashMap<>();
        // iterate through all months to ensure all are present
        // even if no transactions exist for that month
        for (int month = 1; month <= 12; month++) {
            String monthName = Month.of(month).getDisplayName(TextStyle.FULL, Locale.ENGLISH);
            result.put(monthName, groupedByMonth.getOrDefault(month, BigDecimal.ZERO));
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getExpenseTotalByCategory() throws EntityNotFoundException {

        User currentUser = getCurrentUser();
        List<Transaction> transactions = transactionRepository.findAllByUser(currentUser);

        return transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(
                        t -> t.getCategory().name(),
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getAmount, BigDecimal::add)
                ));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionReadDTO> getAllByUser(User user) {

        return transactionRepository.findAllByUser(user)
                .stream()
                .map(Mapper::mapToTransactionReadDTO)
                .collect(Collectors.toList());
    }

    private Transaction findTransactionOrThrow(Long id) throws EntityNotFoundException {
        return transactionRepository.findById(id)
                .orElseThrow(
                        () -> new EntityNotFoundException("Transaction", "Transaction with id " + id + " not found"));
    }

    private User getCurrentUser() throws EntityNotFoundException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User", "User with username " + username + " not found"));
    }
}
