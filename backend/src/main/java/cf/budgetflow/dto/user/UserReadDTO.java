package cf.budgetflow.dto.user;

public record UserReadDTO(
        Long id,
        String username,
        String firstname,
        String lastname
) {
}
