package cf.budgetflow.dto.authentication;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthenticationRequestDTO(
        @Email
        @NotBlank(message = "Email is required")
        String username,
        @NotBlank(message = "Password is required")
        String password
) {
}
