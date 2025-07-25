package cf.budgetflow.service;

import cf.budgetflow.dto.user.PasswordChangeRequestDTO;
import cf.budgetflow.dto.user.UserReadDTO;
import cf.budgetflow.dto.user.UserUpdateDTO;

public interface IUserService {
    UserReadDTO updateUser(String username, UserUpdateDTO dto);
    void deleteUser(String username);
    void changePassword(String username, PasswordChangeRequestDTO dto);
    UserReadDTO getUserByUsername(String username);
}
