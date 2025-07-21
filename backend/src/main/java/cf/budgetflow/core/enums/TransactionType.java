package cf.budgetflow.core.enums;

public enum TransactionType {

    INCOME("Income"),
    EXPENSE("Expense");

    private String displayName;

    TransactionType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
