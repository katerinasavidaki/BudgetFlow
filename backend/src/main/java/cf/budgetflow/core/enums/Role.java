package cf.budgetflow.core.enums;

public enum Role {

    ADMIN("Admin"),
    USER("User");

    private String displayName;

    Role(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
