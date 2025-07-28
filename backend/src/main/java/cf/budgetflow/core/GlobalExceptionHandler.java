package cf.budgetflow.core;

import cf.budgetflow.core.exceptions.*;
import cf.budgetflow.dto.ErrorResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<Map<String , String>> handleValidationException(ValidationException ex) {
        BindingResult bindingResult = ex.getBindingResult();

        Map<String , String> errors = new HashMap<>();
        for (FieldError fieldError : bindingResult.getFieldErrors()) {
            errors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({EntityNotFoundException.class})
    public ResponseEntity<ErrorResponseDTO> handleConstraintViolationException(EntityNotFoundException e) {
        return new ResponseEntity<>(new ErrorResponseDTO(e.getCode(), e.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({EntityAlreadyExistsException.class})
    public ResponseEntity<ErrorResponseDTO> handleConstraintViolationException(EntityAlreadyExistsException e) {
        return new ResponseEntity<>(new ErrorResponseDTO(e.getCode(), e.getMessage()), HttpStatus.CONFLICT);
    }

    @ExceptionHandler({EntityInvalidArgumentException.class})
    public ResponseEntity<ErrorResponseDTO> handleConstraintViolationException(EntityInvalidArgumentException e) {
        return new ResponseEntity<>(new ErrorResponseDTO(e.getCode(), e.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({EntityNotAuthorizedException.class})
    public ResponseEntity<ErrorResponseDTO> handleConstraintViolationException(EntityNotAuthorizedException e) {
        return new ResponseEntity<>(new ErrorResponseDTO(e.getCode(), e.getMessage()), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler({AppServerException.class})
    public ResponseEntity<ErrorResponseDTO> handleConstraintViolationException(AppServerException e) {
        return new ResponseEntity<>(new ErrorResponseDTO(e.getCode(), e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponseDTO> handleRuntimeException(RuntimeException e) {

        return new ResponseEntity<>(new ErrorResponseDTO("500", e.getMessage()),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponseDTO> handleBadCredentials(BadCredentialsException ex) {
        ErrorResponseDTO error = new ErrorResponseDTO("401", "Wrong username or password");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }

}
