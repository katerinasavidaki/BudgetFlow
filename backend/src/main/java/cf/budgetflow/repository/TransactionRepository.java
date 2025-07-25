package cf.budgetflow.repository;

import cf.budgetflow.model.Transaction;
import cf.budgetflow.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {
    // Find transactions by user ID
    List<Transaction> findByUserId(Long userId);
    // Find all transactions for a specific user
    List<Transaction> findAllByUser(User user);

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
