package cf.budgetflow.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRegisterDTO(
        @NotBlank(message = "Username is required")
        @Email
        @Size(min = 4, max = 50, message = "Email must be between 4 and 50 characters")
        String username,

        @NotBlank(message = "Password is required")
        String password,

        @NotBlank(message = "Firstname is required")
        String firstname,

        @NotBlank(message = "Lastname is required")
        String lastname
) {
}
