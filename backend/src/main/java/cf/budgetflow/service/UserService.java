package cf.budgetflow.service;

import cf.budgetflow.core.exceptions.EntityAlreadyExistsException;
import cf.budgetflow.core.exceptions.EntityInvalidArgumentException;
import cf.budgetflow.core.exceptions.EntityNotFoundException;
import cf.budgetflow.dto.user.PasswordChangeRequestDTO;
import cf.budgetflow.dto.user.UserReadDTO;
import cf.budgetflow.dto.user.UserUpdateDTO;
import cf.budgetflow.mapper.Mapper;
import cf.budgetflow.model.User;
import cf.budgetflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(rollbackFor = {Exception.class})
    public UserReadDTO updateUser(UserUpdateDTO dto) throws EntityNotFoundException, EntityAlreadyExistsException {

        User existingUser = userRepository.findById(dto.id())
                .orElseThrow(() -> new EntityNotFoundException("User", "User with id " + dto.id() + " not found"));

        if(!existingUser.getUsername().equals(dto.username()) && userRepository.existsByUsername(dto.username())) {
            throw new EntityAlreadyExistsException("User", "Username already exists");
        }

        Mapper.updateUserFromDTO(dto, existingUser);
        userRepository.save(existingUser);

        return Mapper.toReadDTO(existingUser);
    }

    @Override
    @Transactional(rollbackFor = {Exception.class})
    public void deleteUser() throws EntityNotFoundException {

        User currentUser = getCurrentUser();
        User user = userRepository.findByUsername(currentUser.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User", "User with username "
                        + currentUser.getUsername() + " not found"));

        userRepository.delete(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserReadDTO getUserByUsername(String username) throws EntityNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User", "User not found"));

        return Mapper.toReadDTO(user);
    }

    @Override
    @Transactional(rollbackFor = {Exception.class})
    public void changePassword(PasswordChangeRequestDTO dto) throws EntityNotFoundException, EntityInvalidArgumentException {

        User currentUser = getCurrentUser();
        User user = userRepository.findByUsername(currentUser.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("User", "User not found"));

        if (!passwordEncoder.matches(dto.oldPassword(), user.getPassword())) {
            throw new EntityInvalidArgumentException("Password","Old password is incorrect");
        }

        if (!dto.newPassword().equals(dto.confirmPassword())) {
            throw new EntityInvalidArgumentException("Password","New passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(dto.newPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserReadDTO getUserProfile() throws EntityNotFoundException {
        User user = getCurrentUser();
        return Mapper.toReadDTO(user);
    }

    private User getCurrentUser() throws EntityNotFoundException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User", "User with username " + username + " not found"));
    }
}
