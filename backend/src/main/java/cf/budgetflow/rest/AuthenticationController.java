package cf.budgetflow.rest;

import cf.budgetflow.authentication.AuthenticationService;
import cf.budgetflow.core.exceptions.EntityInvalidArgumentException;
import cf.budgetflow.core.exceptions.EntityNotAuthorizedException;
import cf.budgetflow.core.exceptions.ValidationException;
import cf.budgetflow.dto.authentication.AuthenticationRequestDTO;
import cf.budgetflow.dto.authentication.AuthenticationResponseDTO;
import cf.budgetflow.dto.user.UserRegisterDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @Operation(summary = "Register a new user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "User registered successfully",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = UserRegisterDTO.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input or user already exists",
                    content = @Content)
    })
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponseDTO> register(@RequestBody @Valid UserRegisterDTO dto) throws EntityInvalidArgumentException {
        AuthenticationResponseDTO response = authenticationService.register(dto);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Login with email and password")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login successful",
                    content = @Content(mediaType = "application/json",
                            schema = @Schema(implementation = AuthenticationResponseDTO.class))),
            @ApiResponse(responseCode = "401", description = "Invalid credentials",
                    content = @Content)
    })
    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponseDTO> login(
            @RequestBody @Valid AuthenticationRequestDTO loginDTO,
            BindingResult bindingResult
    ) throws ValidationException, EntityNotAuthorizedException {
        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult);
        }

        AuthenticationResponseDTO response = authenticationService.login(loginDTO);
        return ResponseEntity.ok(response);
    }
}
