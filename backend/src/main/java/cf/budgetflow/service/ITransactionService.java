package cf.budgetflow.service;

import cf.budgetflow.core.exceptions.EntityInvalidArgumentException;
import cf.budgetflow.core.exceptions.EntityNotFoundException;
import cf.budgetflow.dto.transaction.*;
import cf.budgetflow.filters.TransactionFilterRequestDTO;
import cf.budgetflow.model.User;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public interface ITransactionService {

    TransactionReadDTO getTransactionById(Long id) throws EntityNotFoundException;
    List<TransactionReadDTO> getAllTransactions() throws EntityNotFoundException;
    TransactionReadDTO createTransaction(TransactionCreateDTO transaction) throws EntityNotFoundException;
    TransactionReadDTO updateTransaction(TransactionUpdateDTO dto) throws EntityNotFoundException;
    void deleteTransaction(Long id) throws EntityNotFoundException;
    List<TransactionReadDTO> filterTransactions(TransactionFilterRequestDTO dto) throws EntityNotFoundException;
    TransactionSummaryDTO getSummary() throws EntityNotFoundException;
    Map<String, BigDecimal> getMonthlyTotalByType(String type) throws EntityNotFoundException, EntityInvalidArgumentException;
    Map<String, BigDecimal> getExpenseTotalByCategory() throws EntityNotFoundException;
    List<TransactionReadDTO> getAllByUser(User user);
    List<MonthlyStatsDTO> getMonthlyStats() throws EntityNotFoundException;
    List<TransactionStatsByCategoryDTO> getExpenseStatsByCategory() throws EntityNotFoundException;
}
