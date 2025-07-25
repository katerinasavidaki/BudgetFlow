package cf.budgetflow.dto.transaction;

import java.math.BigDecimal;

public record TransactionSummaryDTO(
        BigDecimal totalIncome,
        BigDecimal totalExpense,
        BigDecimal balance,
        Long totalTransactions
) {
}
