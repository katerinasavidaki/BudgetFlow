package cf.budgetflow.service;

import cf.budgetflow.core.exceptions.EntityInvalidArgumentException;
import cf.budgetflow.core.exceptions.EntityNotFoundException;
import cf.budgetflow.dto.user.PasswordChangeRequestDTO;
import cf.budgetflow.dto.user.UserReadDTO;
import cf.budgetflow.dto.user.UserUpdateDTO;
import cf.budgetflow.mapper.Mapper;
import cf.budgetflow.model.User;
import cf.budgetflow.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserReadDTO updateUser(String username, UserUpdateDTO dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User", "User not found"));

        Mapper.updateUserFromDTO(dto, user);
        userRepository.save(user);

        return Mapper.toReadDTO(user);
    }

    @Override
    @Transactional
    public void deleteUser(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User", "User not found"));

        userRepository.delete(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserReadDTO getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User", "User not found"));

        return Mapper.toReadDTO(user);
    }

    @Override
    @Transactional
    public void changePassword(String username, PasswordChangeRequestDTO dto) {

        User user = userRepository.findByUsername(username)
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
}
