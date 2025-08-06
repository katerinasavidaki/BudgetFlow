package cf.budgetflow.dto.transaction;

import cf.budgetflow.core.enums.Category;
import cf.budgetflow.core.enums.TransactionType;
import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyStatsDTO {

    private int month;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;


}
