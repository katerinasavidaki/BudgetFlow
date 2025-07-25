package cf.budgetflow.service;

import cf.budgetflow.core.enums.TransactionType;
import cf.budgetflow.core.exceptions.EntityInvalidArgumentException;
import cf.budgetflow.core.exceptions.EntityNotFoundException;
import cf.budgetflow.dto.transaction.TransactionCreateDTO;
import cf.budgetflow.dto.transaction.TransactionReadDTO;
import cf.budgetflow.dto.transaction.TransactionSummaryDTO;
import cf.budgetflow.dto.transaction.TransactionUpdateDTO;
import cf.budgetflow.filters.TransactionFilterRequestDTO;
import cf.budgetflow.mapper.Mapper;
import cf.budgetflow.model.Transaction;
import cf.budgetflow.model.User;
import cf.budgetflow.repository.TransactionRepository;
import cf.budgetflow.repository.UserRepository;
import cf.budgetflow.specifications.TransactionSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
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

import static java.util.Locale.ENGLISH;

@Service
@RequiredArgsConstructor
public class TransactionService implements ITransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public TransactionReadDTO getTransactionById(Long id, String username) {
        Transaction transaction = findTransactionOrThrow(id);
        if (!transaction.getUser().getUsername().equals(username)) {
            throw new EntityNotFoundException("Transaction", "Transaction with id " + id + " not found for user " + username);
        }
        return Mapper.mapToTransactionReadDTO(transaction);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionReadDTO> getAllTransactions(String username) {
        List<Transaction> transactions = transactionRepository.findByUserId(findUserOrThrow(username).getId());
        return transactions.stream()
                .map(Mapper::mapToTransactionReadDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TransactionReadDTO createTransaction(TransactionCreateDTO dto, String username) {
        User user = findUserOrThrow(username);
        Transaction transaction = Mapper.mapToTransaction(dto);
        user.addTransaction(transaction);
        Transaction saved = transactionRepository.save(transaction);
        return Mapper.mapToTransactionReadDTO(saved);
    }

    @Override
    @Transactional
    public TransactionReadDTO updateTransaction(TransactionUpdateDTO dto, String username) {
        Transaction transaction = findTransactionOrThrow(dto.id());
        if (!transaction.getUser().getUsername().equals(username)) {
            throw new EntityNotFoundException("Transaction", "Transaction with id " + dto.id() + " not found for user " + username);
        }

        Mapper.updateTransactionFromDTO(dto, transaction);
        Transaction updated = transactionRepository.save(transaction);
        return Mapper.mapToTransactionReadDTO(updated);
    }

    @Override
    @Transactional
    public void deleteTransaction(Long id, String username) {

        Transaction transaction = findTransactionOrThrow(id);
        if (!transaction.getUser().getUsername().equals(username)) {
            throw new EntityNotFoundException("Transaction", "Transaction with id " + id + " not found for user " + username);
        }
        User user = transaction.getUser();
        user.removeTransaction(transaction);
        transactionRepository.delete(transaction);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TransactionReadDTO> filterTransactions(TransactionFilterRequestDTO dto, String username) {

        Long userId = findUserOrThrow(username).getId();

        Specification<Transaction> specification =
                TransactionSpecifications.belongsToUser(userId)
                .and(TransactionSpecifications.hasType(dto.type()))
                .and(TransactionSpecifications.hasCategory(dto.category()))
                .and(TransactionSpecifications.hasMethod(dto.paymentMethod()))
                .and(TransactionSpecifications.dateBetween(dto.fromDate(), dto.toDate()))
                .and(TransactionSpecifications.amountBetween(dto.minAmount(), dto.maxAmount()));

        return transactionRepository.findAll(specification).stream()
                .map(Mapper::mapToTransactionReadDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TransactionSummaryDTO getSummary(String username) {

        BigDecimal income = transactionRepository.getTotalIncome(username);
        BigDecimal expense = transactionRepository.getTotalExpense(username);
        Long count = transactionRepository.getTotalTransactionCount(username);
        return new TransactionSummaryDTO(income, expense, income.subtract(expense), count);
    }

    @Override
    @Transactional(readOnly = true)
        public Map<String, BigDecimal> getMonthlyTotalByType(String username, String type) {

        TransactionType transactionType;
        try {
            transactionType = TransactionType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new EntityInvalidArgumentException("Type", "Invalid transaction type: " + type);
        }

        List<Transaction> transactions = transactionRepository.findAllByUser(findUserOrThrow(username));

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
    public Map<String, BigDecimal> getExpenseTotalByCategory(String username) {

        List<Transaction> transactions = transactionRepository.findAllByUser(findUserOrThrow(username));

        return transactions.stream()
                .filter(t -> t.getType() == TransactionType.EXPENSE)
                .collect(Collectors.groupingBy(
                        t -> t.getCategory().name(),
                        Collectors.mapping(Transaction::getAmount, Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
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

    private User findUserOrThrow(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(
                        () -> new EntityNotFoundException("User", "User with username " + username + " not found"));
    }

    private Transaction findTransactionOrThrow(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(
                        () -> new EntityNotFoundException("Transaction", "Transaction with id " + id + " not found"));
    }
}
