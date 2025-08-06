package cf.budgetflow.repository;

import cf.budgetflow.core.enums.TransactionType;
import cf.budgetflow.dto.transaction.MonthlyStatsDTO;
import cf.budgetflow.dto.transaction.TransactionStatsByCategoryDTO;
import cf.budgetflow.model.Transaction;
import cf.budgetflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {
    // Find transactions by user ID
    List<Transaction> findByUserId(Long userId);
    // Find all transactions for a specific user
    List<Transaction> findAllByUser(User user);
    List<Transaction> findByUserAndType(User user, TransactionType type);


    @Query("""
            SELECT new cf.budgetflow.dto.transaction.MonthlyStatsDTO(
            MONTH(t.date),
            SUM(CASE WHEN t.type = 'INCOME' THEN t.amount ELSE 0 END),
            SUM(CASE WHEN t.type = 'EXPENSE' THEN t.amount ELSE 0 END)
            )
            FROM Transaction t
            WHERE t.user.username = :username
            AND YEAR(t.date) = YEAR(CURRENT_DATE)
            GROUP BY MONTH(t.date)
            ORDER BY MONTH(t.date)
            """)
    List<MonthlyStatsDTO> getMonthlyStats(@Param("username") String username);

    List<Transaction> findByUserUsernameAndDateBetween(String username, LocalDate start, LocalDate end);


    @Query("""
            SELECT new cf.budgetflow.dto.transaction.TransactionStatsByCategoryDTO(
                t.category, t.type, SUM(t.amount)
            )
            FROM Transaction t
            WHERE t.user.username = :username
            AND t.type = cf.budgetflow.core.enums.TransactionType.EXPENSE
            AND YEAR(t.date) = YEAR(CURRENT_DATE)
            AND MONTH(t.date) = MONTH(CURRENT_DATE)
            GROUP BY t.category, t.type
            """)
    List<TransactionStatsByCategoryDTO> getExpenseStatsByCategory(@Param("username") String username);


    // Calculate total income
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
            "WHERE t.user.username = :username AND t.type = 'INCOME'")
    BigDecimal getTotalIncome(String username);

    // Calculate total expenses
    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM Transaction t " +
            "WHERE t.user.username = :username AND t.type = 'EXPENSE'")
    BigDecimal getTotalExpense(String username);

    //  Sum of all transactions
    @Query("SELECT COUNT(t) FROM Transaction t WHERE t.user.username = :username")
    Long getTotalTransactionCount(String username);
}
