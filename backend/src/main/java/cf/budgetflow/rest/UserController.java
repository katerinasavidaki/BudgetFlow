package cf.budgetflow.rest;

import cf.budgetflow.core.exceptions.EntityAlreadyExistsException;
import cf.budgetflow.core.exceptions.EntityInvalidArgumentException;
import cf.budgetflow.core.exceptions.EntityNotFoundException;
import cf.budgetflow.core.exceptions.ValidationException;
import cf.budgetflow.dto.user.PasswordChangeRequestDTO;
import cf.budgetflow.dto.user.UserReadDTO;
import cf.budgetflow.dto.user.UserUpdateDTO;
import cf.budgetflow.service.IUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User", description = "Endpoints for user profile management")
public class UserController {

    private final IUserService userService;

    @Operation(
            summary = "Get logged-in user profile",
            security = @SecurityRequirement(name = "Bearer Authentication"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "User found",
                            content = @Content(schema = @Schema(implementation = UserReadDTO.class))),
                    @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
            }
    )
    @GetMapping("/me")
    public ResponseEntity<UserReadDTO> getUserProfile() throws EntityNotFoundException {
        UserReadDTO returnedUser = userService.getUserProfile();
        return ResponseEntity.ok(returnedUser);
    }

    @Operation(
            summary = "Update user profile",
            security = @SecurityRequirement(name = "Bearer Authentication"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "User updated successfully",
                            content = @Content(schema = @Schema(implementation = UserReadDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
                    @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
            }
    )
    @PutMapping("/me")
    public ResponseEntity<UserReadDTO> updateUser(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    required = true,
                    description = "User update information"
            )
            @Valid @RequestBody UserUpdateDTO dto, BindingResult bindingResult) throws ValidationException, EntityAlreadyExistsException, EntityNotFoundException {

        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult);
        }

        UserReadDTO updated = userService.updateUser(dto);
        return ResponseEntity.ok(updated);
    }

    @Operation(
            summary = "Change user password",
            security = @SecurityRequirement(name = "Bearer Authentication"),
            responses = {
                    @ApiResponse(responseCode = "204", description = "Password changed successfully"),
                    @ApiResponse(responseCode = "400", description = "Invalid request", content = @Content),
                    @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
            }
    )
    @PutMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @Valid @RequestBody PasswordChangeRequestDTO dto, BindingResult bindingResult)
            throws EntityInvalidArgumentException, EntityNotFoundException, ValidationException {

        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult);
        }

        userService.changePassword(dto);
        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Delete user account",
            security = @SecurityRequirement(name = "Bearer Authentication"),
            responses = {
                    @ApiResponse(responseCode = "204", description = "User deleted successfully"),
                    @ApiResponse(responseCode = "403", description = "Forbidden", content = @Content),
                    @ApiResponse(responseCode = "401", description = "Unauthorized", content = @Content)
            }
    )
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteUser() throws EntityNotFoundException {
        userService.deleteUser();
        return ResponseEntity.noContent().build();
    }


}
