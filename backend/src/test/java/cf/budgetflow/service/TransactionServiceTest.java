package cf.budgetflow.service;

import cf.budgetflow.core.enums.Category;
import cf.budgetflow.core.enums.PaymentMethod;
import cf.budgetflow.core.enums.TransactionType;
import cf.budgetflow.core.exceptions.EntityNotFoundException;
import cf.budgetflow.dto.transaction.TransactionCreateDTO;
import cf.budgetflow.dto.transaction.TransactionReadDTO;
import cf.budgetflow.filters.TransactionFilterRequestDTO;
import cf.budgetflow.mapper.Mapper;
import cf.budgetflow.model.Transaction;
import cf.budgetflow.model.User;
import cf.budgetflow.repository.TransactionRepository;
import cf.budgetflow.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TransactionService transactionService;

    private final String TEST_USERNAME = "testuser@example.com";
    private final Long TEST_USER_ID = 1L;

    private User testUser;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        testUser = new User();
        testUser.setId(TEST_USER_ID);
        testUser.setUsername(TEST_USERNAME);

        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn(TEST_USERNAME);
        SecurityContext context = mock(SecurityContext.class);
        when(context.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(context);

        when(userRepository.findByUsername(TEST_USERNAME)).thenReturn(Optional.of(testUser));
    }

    @Test
    void getTransactionByIdPositiveTest() throws EntityNotFoundException {
        Transaction transaction = transaction(testUser, TransactionType.EXPENSE, Category.FOOD,
                PaymentMethod.CASH, "12.50", LocalDate.now());
        transaction.setId(1L);
        when(transactionRepository.findById(1L)).thenReturn(Optional.of(transaction));

        TransactionReadDTO dto = transactionService.getTransactionById(1L);

        assertThat(dto.id()).isEqualTo(1L);
        assertThat(dto.type()).isEqualTo(TransactionType.EXPENSE);
        assertThat(dto.category()).isEqualTo(Category.FOOD);
        verify(transactionRepository).findById(1L);
    }

    @Test
    void getTransactionByIdNegativeTest() {
        User user = new User();
        user.setId(999L);
        user.setUsername("user@x.dev");
        Transaction transaction = transaction(user, TransactionType.EXPENSE, Category.FOOD,
                PaymentMethod.CASH, "10.00", LocalDate.now());
        transaction.setId(2L);
        when(transactionRepository.findById(2L)).thenReturn(Optional.of(transaction));

        assertThatThrownBy(() -> transactionService.getTransactionById(2L))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessageContaining("not found");
    }

    @Test
    void getAllTransactionsTest() throws EntityNotFoundException {
        Transaction transaction1 = transaction(testUser, TransactionType.INCOME, Category.RENT, PaymentMethod.BANK_TRANSFER,
                "1000.00", LocalDate.now());
        Transaction transaction2 = transaction(testUser, TransactionType.EXPENSE, Category.UTILITIES, PaymentMethod.CASH,
                "200.00", LocalDate.now());
        when(transactionRepository.findAllByUser(testUser)).thenReturn(List.of(transaction1, transaction2));

        List<TransactionReadDTO> result = transactionService.getAllTransactions();

        assertThat(result).hasSize(2);
        verify(transactionRepository).findAllByUser(testUser);
    }

    @Test
    void filterTransactionsTest() throws EntityNotFoundException {
        TransactionFilterRequestDTO dto = new TransactionFilterRequestDTO();
        dto.setType(TransactionType.EXPENSE);
        dto.setCategory(Category.FOOD);
        dto.setPaymentMethod(PaymentMethod.CASH);
        dto.setFromDate(LocalDate.of(2025, 7, 10));
        dto.setToDate(LocalDate.of(2025, 8, 31));

        Transaction mockTransaction = new Transaction();
        mockTransaction.setId(1L);
        mockTransaction.setUser(testUser);
        mockTransaction.setType(TransactionType.EXPENSE);
        mockTransaction.setCategory(Category.FOOD);
        mockTransaction.setPaymentMethod(PaymentMethod.CASH);
        mockTransaction.setAmount(new BigDecimal("10.00"));
        mockTransaction.setDate(LocalDate.of(2025, 8, 10));

        when(transactionRepository.findAll(ArgumentMatchers.<Specification<Transaction>>any()))
                .thenReturn(List.of(mockTransaction));

        List<TransactionReadDTO> result = transactionService.filterTransactions(dto);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).id()).isEqualTo(mockTransaction.getId());
        assertThat(result.get(0).type()).isEqualTo(TransactionType.EXPENSE);
        assertThat(result.get(0).category()).isEqualTo(Category.FOOD);
        assertThat(result.get(0).paymentMethod()).isEqualTo(PaymentMethod.CASH);

        verify(transactionRepository, times(1))
                .findAll(ArgumentMatchers.<Specification<Transaction>>any());
        verify(userRepository, times(1))
                .findByUsername(TEST_USERNAME);
    }

    private static Transaction transaction(User user, TransactionType type, Category category, PaymentMethod method,
                                           String amount, LocalDate date) {
        Transaction transaction = new Transaction();
        transaction.setUser(user);
        transaction.setType(type);
        transaction.setCategory(category);
        transaction.setPaymentMethod(method);
        transaction.setAmount(new BigDecimal(amount));
        transaction.setDate(date);
        return transaction;
    }
}
