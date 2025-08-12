package cf.budgetflow.core.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Category {

    FOOD("Food"),
    TRANSPORT("Transport"),
    RENT("Rent"),
    SALARY("Salary"),
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

    @JsonCreator
    public static Category fromString(String value) {
        return Category.valueOf(value.toUpperCase());
    }

}
