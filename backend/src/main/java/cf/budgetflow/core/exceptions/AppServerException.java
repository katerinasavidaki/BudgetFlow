package cf.budgetflow.core.exceptions;

import lombok.Getter;

@Getter
public class AppServerException extends GenericException {


    public AppServerException(String message) {
        super("INTERNAL_SERVER_ERROR", message);
    }
}
