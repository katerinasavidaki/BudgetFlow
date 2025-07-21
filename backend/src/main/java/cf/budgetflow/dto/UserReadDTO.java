package cf.budgetflow.dto;

public record UserReadDTO(
        Long id,
        String username,
        String firstname,
        String lastname
) {
}
