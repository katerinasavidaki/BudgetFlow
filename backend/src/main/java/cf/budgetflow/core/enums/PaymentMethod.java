package cf.budgetflow.core.enums;

public enum PaymentMethod {

    CASH("Cash"),
    CARD("Card"),
    BANK_TRANSFER("Bank Transfer"),
    OTHER("Other");

    private String displayName;

    PaymentMethod(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
