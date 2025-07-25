package cf.budgetflow.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PasswordChangeRequestDTO(
        @NotNull(message = "Id is required") Long userId,
        @NotBlank(message = "Old password is required") String oldPassword,
        @NotBlank(message = "New password is required") String newPassword,
        @NotBlank(message = "Confirm password is required") String confirmPassword
) {
}
