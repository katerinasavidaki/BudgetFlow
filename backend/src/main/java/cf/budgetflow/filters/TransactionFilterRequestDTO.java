package cf.budgetflow.filters;

import cf.budgetflow.core.enums.Category;
import cf.budgetflow.core.enums.PaymentMethod;
import cf.budgetflow.core.enums.TransactionType;
import lombok.*;
import org.springframework.lang.Nullable;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TransactionFilterRequestDTO {

    @Nullable
    private TransactionType type;

    @Nullable
    private Category category;

    @Nullable
    private PaymentMethod paymentMethod;

    @Nullable
    private LocalDate fromDate;

    @Nullable
    private LocalDate toDate;

    @Nullable
    private BigDecimal minAmount;

    @Nullable
    private BigDecimal maxAmount;
}
