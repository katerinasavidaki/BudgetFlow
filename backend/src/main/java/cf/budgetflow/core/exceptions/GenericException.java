package cf.budgetflow.core.exceptions;

import lombok.Getter;

@Getter
public abstract class GenericException extends Exception {

    private final String code;

    protected GenericException(String code, String message) {
        super(message);
        this.code = code;
    }

}
