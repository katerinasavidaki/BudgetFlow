package cf.budgetflow.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.lang.Nullable;

public record UserUpdateDTO(
        @NotNull(message = "Id is required")
        Long id,

        @Nullable
        @Email
        @Size(min = 5, max = 50, message = "Email must be between 5 and 50 characters")
        String username,     // email

        @Nullable
        @Size(min = 4, max = 50, message = "Firstname must be between 4 and 50 characters")
        String firstname,

        @Nullable
        @Size(min = 4, max = 50, message = "Lastname must be between 4 and 50 characters")
        String lastname
) {
}
