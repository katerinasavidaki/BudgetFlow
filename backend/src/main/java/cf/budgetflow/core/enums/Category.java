package cf.budgetflow.core.enums;

public enum Category {

    FOOD("Food"),
    TRANSPORT("Transport"),
    RENT("Rent"),
    ENTERTAINMENT("Entertainment"),
    HEALTH("Health"),
    UTILITIES("Utilities"),
    SHOPPING("Shopping"),
    TRAVEL("Travel"),
    EDUCATION("Education"),
    OTHER("Other");


    private String displayName;

    Category(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

}
