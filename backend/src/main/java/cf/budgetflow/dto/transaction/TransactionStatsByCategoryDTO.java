package cf.budgetflow.dto.transaction;

import cf.budgetflow.core.enums.Category;
import cf.budgetflow.core.enums.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionStatsByCategoryDTO {

    private Category category;
    private TransactionType type;
    private BigDecimal totalAmount;
}
