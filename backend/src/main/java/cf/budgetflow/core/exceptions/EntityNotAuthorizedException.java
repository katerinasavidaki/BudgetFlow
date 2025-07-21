package cf.budgetflow.core.exceptions;

public class EntityNotAuthorizedException extends GenericException {

    private static final String DEFAULT_CODE = "NotAuthorized";

    public EntityNotAuthorizedException(String code, String message) {
        super(code + DEFAULT_CODE, message);
    }
}
