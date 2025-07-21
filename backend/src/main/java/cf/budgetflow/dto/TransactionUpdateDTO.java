package cf.budgetflow.dto;

import cf.budgetflow.core.enums.Category;
import cf.budgetflow.core.enums.PaymentMethod;
import cf.budgetflow.core.enums.TransactionType;
import jakarta.validation.constraints.*;
import org.springframework.lang.Nullable;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionUpdateDTO(
        @NotNull(message = "Id is required")
        Long id,

        @Nullable
        @Size(max = 100, message = "Title must not exceed 100 characters")
        String description,

        @Nullable
        @DecimalMin(value = "0.01", inclusive = true, message = "Amount must be greater than 0")
        @DecimalMax(value = "1000000.00", inclusive = true, message = "Amount must not exceed 1,000,000")
        BigDecimal amount,

        @Nullable
        TransactionType type,

        @Nullable
        Category category,
        @Nullable
        PaymentMethod paymentMethod,
        @Nullable
        @PastOrPresent(message = "Date must be in the past or present")
        LocalDate date
) {
}
