package cf.budgetflow.core.exceptions;

public class EntityNotFoundException extends GenericException {

    public static final String DEFAULT_CODE = "NotFound";

    public EntityNotFoundException(String code, String message) {
        super(code + DEFAULT_CODE, message);
    }
}
