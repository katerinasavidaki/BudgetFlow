package cf.budgetflow.service;

import cf.budgetflow.core.exceptions.EntityAlreadyExistsException;
import cf.budgetflow.core.exceptions.EntityInvalidArgumentException;
import cf.budgetflow.core.exceptions.EntityNotFoundException;
import cf.budgetflow.dto.user.PasswordChangeRequestDTO;
import cf.budgetflow.dto.user.UserReadDTO;
import cf.budgetflow.dto.user.UserUpdateDTO;

public interface IUserService {
    UserReadDTO updateUser(UserUpdateDTO dto) throws EntityNotFoundException, EntityAlreadyExistsException;
    void deleteUser() throws EntityNotFoundException;
    void changePassword(PasswordChangeRequestDTO dto) throws EntityNotFoundException, EntityInvalidArgumentException;
    UserReadDTO getUserByUsername(String username) throws EntityNotFoundException;
    UserReadDTO getUserProfile() throws EntityNotFoundException;
}
