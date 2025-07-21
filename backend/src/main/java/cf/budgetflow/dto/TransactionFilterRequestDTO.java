package cf.budgetflow.dto;

import cf.budgetflow.core.enums.Category;
import cf.budgetflow.core.enums.PaymentMethod;
import cf.budgetflow.core.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionFilterRequestDTO(
        TransactionType type,
        Category category,
        PaymentMethod paymentMethod,
        LocalDate fromDate,
        LocalDate toDate,
        BigDecimal minAmount,
        BigDecimal maxAmount
) {
}
