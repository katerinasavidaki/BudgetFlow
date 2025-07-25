package cf.budgetflow.service;

import cf.budgetflow.core.enums.TransactionType;
import cf.budgetflow.dto.transaction.TransactionCreateDTO;
import cf.budgetflow.dto.transaction.TransactionReadDTO;
import cf.budgetflow.dto.transaction.TransactionSummaryDTO;
import cf.budgetflow.dto.transaction.TransactionUpdateDTO;
import cf.budgetflow.filters.TransactionFilterRequestDTO;
import cf.budgetflow.model.User;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface ITransactionService {

    TransactionReadDTO getTransactionById(Long id, String username);
    List<TransactionReadDTO> getAllTransactions(String username);
    TransactionReadDTO createTransaction(TransactionCreateDTO transaction, String username);
    TransactionReadDTO updateTransaction(TransactionUpdateDTO dto, String username);
    void deleteTransaction(Long id, String username);
    List<TransactionReadDTO> filterTransactions(TransactionFilterRequestDTO dto, String username);
    TransactionSummaryDTO getSummary(String username);
    Map<String, BigDecimal> getMonthlyTotalByType(String username, String type);
    Map<String, BigDecimal> getExpenseTotalByCategory(String username);
    List<TransactionReadDTO> getAllByUser(User user);
}
