package cf.budgetflow.core.exceptions;

public class EntityInvalidArgumentException extends GenericException {

    private static final String DEFAULT_CODE = "InvalidArgument";

    public EntityInvalidArgumentException(String code, String message) {
        super(code + DEFAULT_CODE, message);
    }
}
