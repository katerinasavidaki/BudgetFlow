package cf.budgetflow.core.exceptions;

import lombok.Getter;
import org.springframework.validation.BindingResult;

@Getter
public class ValidationException extends GenericException {

    private final BindingResult bindingResult;

    public ValidationException(BindingResult bindingResult) {
        super("VALIDATION_ERROR","Validation failed");
        this.bindingResult = bindingResult;
    }
}
