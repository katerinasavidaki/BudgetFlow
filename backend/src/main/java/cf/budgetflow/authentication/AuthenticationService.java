package cf.budgetflow.authentication;

import cf.budgetflow.core.enums.Role;
import cf.budgetflow.core.exceptions.EntityInvalidArgumentException;
import cf.budgetflow.core.exceptions.EntityNotAuthorizedException;
import cf.budgetflow.dto.authentication.AuthenticationRequestDTO;
import cf.budgetflow.dto.authentication.AuthenticationResponseDTO;
import cf.budgetflow.dto.user.UserRegisterDTO;
import cf.budgetflow.model.User;
import cf.budgetflow.repository.UserRepository;
import cf.budgetflow.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    /**
     * Register new user and return JWT token.
     */
    public AuthenticationResponseDTO register(UserRegisterDTO dto) {
        if (userRepository.existsByUsername(dto.username())) {
            throw new EntityInvalidArgumentException("User", "User with username " + dto.username() + " already exists");
        }

        User user = User.builder()
                .firstname(dto.firstname())
                .lastname(dto.lastname())
                .username(dto.username())
                .role(Role.USER)
                .password(passwordEncoder.encode(dto.password()))
                .build();

        userRepository.save(user);

        String jwtToken = jwtService.generateToken(user.getUsername());

        return new AuthenticationResponseDTO(dto.username(), jwtToken);
    }

    /**
     * Authenticate existing user and return JWT token.
     */
    public AuthenticationResponseDTO login(AuthenticationRequestDTO dto) {
        // Validates username/password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.username(),
                        dto.password()));

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new EntityNotAuthorizedException("User",
                        "User not authorized"));

        String token = jwtService.generateToken(authentication.getName());
        return new AuthenticationResponseDTO(user.getUsername(),
                token);
    }
}
