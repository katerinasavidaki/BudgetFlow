package cf.budgetflow.specifications;

import cf.budgetflow.core.enums.Category;
import cf.budgetflow.core.enums.PaymentMethod;
import cf.budgetflow.core.enums.TransactionType;
import cf.budgetflow.model.Transaction;
import org.springframework.data.jpa.domain.Specification;
import java.math.BigDecimal;
import java.time.LocalDate;

public class TransactionSpecifications {

    private TransactionSpecifications() {}

    public static Specification<Transaction> belongsToUser(Long userId) {
        return (root, query, cb) -> cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Transaction> hasCategory(Category category) {
        return (root, query, cb) -> {
            if (category == null) return cb.conjunction();
            return cb.equal(root.get("category"), category);
        };
    }

    public static Specification<Transaction> hasMethod(PaymentMethod method) {
        return (root, query, cb) -> {
            if (method == null) return cb.conjunction();
            return cb.equal(root.get("paymentMethod"), method);
        };
    }

    public static Specification<Transaction> hasType(TransactionType type) {
        return (root, query, cb) -> {
            if (type == null) return cb.conjunction();
            return cb.equal(root.get("type"), type);
        };
    }

    public static Specification<Transaction> dateBetween(LocalDate from, LocalDate to) {
        return (root, query, cb) -> {
            if (from == null && to == null) return cb.conjunction();
            if (from == null) return cb.lessThanOrEqualTo(root.get("date"), to);
            if (to == null) return cb.greaterThanOrEqualTo(root.get("date"), from);
            return cb.between(root.get("date"), from, to);
        };
    }

    public static Specification<Transaction> amountBetween(BigDecimal min, BigDecimal max) {
        return (root, query, cb) -> {
            if (min == null && max == null) return cb.conjunction();
            if (min == null) return cb.lessThanOrEqualTo(root.get("amount"), max);
            if (max == null) return cb.greaterThanOrEqualTo(root.get("amount"), min);
            return cb.between(root.get("amount"), min, max);
        };
    }
}
