package cf.budgetflow.dto.transaction;

import cf.budgetflow.core.enums.Category;
import cf.budgetflow.core.enums.PaymentMethod;
import cf.budgetflow.core.enums.TransactionType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionCreateDTO(
        @NotBlank(message = "Description is required")
        @Size(max = 100, message = "Title must not exceed 100 characters")
        String description,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01", inclusive = true, message = "Amount must be greater than 0")
        @DecimalMax(value = "1000000.00", inclusive = true, message = "Amount must not exceed 1,000,000")
        BigDecimal amount,

        @NotNull(message = "Transaction type is required")
        TransactionType type,

        @NotNull(message = "Category is required")
        Category category,

        @NotNull(message = "Payment method is required")
        PaymentMethod paymentMethod,

        @NotNull(message = "Date is required")
        @PastOrPresent(message = "Date must be in the past or present")
        LocalDate date
) {
}
