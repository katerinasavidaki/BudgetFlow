package cf.budgetflow.mapper;

import cf.budgetflow.dto.transaction.TransactionCreateDTO;
import cf.budgetflow.dto.transaction.TransactionReadDTO;
import cf.budgetflow.dto.transaction.TransactionUpdateDTO;
import cf.budgetflow.dto.user.UserReadDTO;
import cf.budgetflow.dto.user.UserRegisterDTO;
import cf.budgetflow.dto.user.UserUpdateDTO;
import cf.budgetflow.model.Transaction;
import cf.budgetflow.model.User;

import java.util.List;
import java.util.stream.Collectors;

public class Mapper {

    // ======================
    //        USER
    // ======================


    public static User mapToUser(UserRegisterDTO dto) {
        User user = new User();
        user.setUsername(dto.username());
        user.setFirstname(dto.firstname());
        user.setLastname(dto.lastname());
        user.setPassword(dto.password()); // password encoding is handled in service
        return user;
    }

    public static UserReadDTO toReadDTO(User user) {
        if (user == null) {
            return null;
        }
        return new UserReadDTO(user.getId(),
                user.getUsername(),
                user.getFirstname(),
                user.getLastname());
    }

    public static void updateUserFromDTO(UserUpdateDTO dto, User user) {
        if (dto.firstname() != null) user.setFirstname(dto.firstname());
        if (dto.lastname() != null) user.setLastname(dto.lastname());
        if (dto.username() != null) user.setUsername(dto.username());
    }

    // ============================
    //        TRANSACTION
    // ============================

    public static TransactionReadDTO mapToTransactionReadDTO(Transaction transaction) {
        return new TransactionReadDTO(transaction.getId(),
                transaction.getAmount(),
                transaction.getDescription(),
                transaction.getType(),
                transaction.getCategory(),
                transaction.getPaymentMethod(),
                transaction.getDate());
    }

    public static List<TransactionReadDTO> mapToTransactionReadDTOList(List<Transaction> transactions) {
        return transactions.stream()
                .map(Mapper::mapToTransactionReadDTO)
                .collect(Collectors.toList());
    }

    public static Transaction mapToTransaction(TransactionCreateDTO dto) {
        Transaction transaction = new Transaction();
        transaction.setAmount(dto.amount());
        transaction.setType(dto.type());
        transaction.setCategory(dto.category());
        transaction.setPaymentMethod(dto.paymentMethod());
        transaction.setDescription(dto.description());
        transaction.setDate(dto.date());
        return transaction;
    }

    public static void updateTransactionFromDTO(TransactionUpdateDTO dto, Transaction transaction) {
        if (dto.amount() != null) transaction.setAmount(dto.amount());
        if (dto.type() != null) transaction.setType(dto.type());
        if (dto.category() != null) transaction.setCategory(dto.category());
        if (dto.paymentMethod() != null) transaction.setPaymentMethod(dto.paymentMethod());
        if (dto.description() != null) transaction.setDescription(dto.description());
        if (dto.date() != null) transaction.setDate(dto.date());
    }

}
