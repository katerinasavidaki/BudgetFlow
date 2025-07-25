package cf.budgetflow.dto.transaction;

import cf.budgetflow.core.enums.Category;
import cf.budgetflow.core.enums.PaymentMethod;
import cf.budgetflow.core.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionReadDTO(
        Long id,
        BigDecimal amount,
        String description,
        TransactionType type,
        Category category,
        PaymentMethod paymentMethod,
        LocalDate date
) {
}
