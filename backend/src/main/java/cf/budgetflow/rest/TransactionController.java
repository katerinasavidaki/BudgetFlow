package cf.budgetflow.rest;

import cf.budgetflow.core.exceptions.EntityInvalidArgumentException;
import cf.budgetflow.core.exceptions.EntityNotFoundException;
import cf.budgetflow.core.exceptions.ValidationException;
import cf.budgetflow.dto.transaction.*;
import cf.budgetflow.filters.TransactionFilterRequestDTO;
import cf.budgetflow.service.ITransactionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@Tag(name = "Transactions", description = "Endpoints for managing user transactions")
public class TransactionController {

    private final ITransactionService transactionService;

    @Operation(
            summary = "Get all transactions for logged-in user",
            security = @SecurityRequirement(name = "Bearer Authentication"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Transactions retrieved successfully",
                            content = @Content(schema = @Schema(implementation = TransactionReadDTO.class)))
            }
    )
    @GetMapping
    public ResponseEntity<List<TransactionReadDTO>> getAllTransactions() throws EntityNotFoundException {
        List<TransactionReadDTO> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    @Operation(
            summary = "Get transaction by ID",
            security = @SecurityRequirement(name = "Bearer Authentication"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Transaction found",
                            content = @Content(schema = @Schema(implementation = TransactionReadDTO.class))),
                    @ApiResponse(responseCode = "404", description = "Transaction not found", content = @Content)
            }
    )
    @GetMapping("/{id}")
    public ResponseEntity<TransactionReadDTO> getTransactionById(@PathVariable Long id) throws EntityNotFoundException {
        return ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    @Operation(
            summary = "Create a new transaction",
            security = @SecurityRequirement(name = "Bearer Authentication"),
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Transaction data", required = true,
                    content = @Content(schema = @Schema(implementation = TransactionCreateDTO.class))
            ),
            responses = {
                    @ApiResponse(responseCode = "201", description = "Transaction created successfully",
                            content = @Content(schema = @Schema(implementation = TransactionReadDTO.class))),
                    @ApiResponse(responseCode = "400", description = "Invalid input", content = @Content)
            }
    )
    @PostMapping
    public ResponseEntity<TransactionReadDTO> create(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Transaction data", required = true
            )
            @Valid @RequestBody TransactionCreateDTO dto, BindingResult bindingResult)
            throws ValidationException, EntityNotFoundException {

        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult);
        }
        System.out.println("Creating transaction: " + dto);
        return ResponseEntity.ok(transactionService.createTransaction(dto));
    }

    @Operation(
            summary = "Update existing transaction",
            security = @SecurityRequirement(name = "Bearer Authentication"),
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Transaction update data", required = true,
                    content = @Content(schema = @Schema(implementation = TransactionUpdateDTO.class))
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Transaction updated successfully",
                            content = @Content(schema = @Schema(implementation = TransactionReadDTO.class))),
                    @ApiResponse(responseCode = "404", description = "Transaction not found", content = @Content)
            }
    )
    @PutMapping
    public ResponseEntity<TransactionReadDTO> update(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Transaction update data", required = true)
            @Valid @RequestBody TransactionUpdateDTO dto, BindingResult bindingResult) throws ValidationException, EntityNotFoundException {

        if (bindingResult.hasErrors()) {
            throw new ValidationException(bindingResult);
        }
        return ResponseEntity.ok(transactionService.updateTransaction(dto));
    }

    @Operation(
            summary = "Delete transaction by ID",
            security = @SecurityRequirement(name = "Bearer Authentication"),
            responses = {
                    @ApiResponse(responseCode = "204", description = "Transaction deleted successfully"),
                    @ApiResponse(responseCode = "404", description = "Transaction not found", content = @Content)
            }
    )
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) throws EntityNotFoundException {
        transactionService.deleteTransaction(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Filter transactions by criteria",
            security = @SecurityRequirement(name = "Bearer Authentication"),
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Filter parameters", required = true,
                    content = @Content(schema = @Schema(implementation = TransactionFilterRequestDTO.class))
            ),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Filtered transactions retrieved",
                            content = @Content(schema = @Schema(implementation = TransactionReadDTO.class)))
            }
    )
    @PostMapping("/filter")
    public ResponseEntity<List<TransactionReadDTO>> filter(
            @Valid @Nullable @RequestBody TransactionFilterRequestDTO filters) throws EntityNotFoundException {
        if (filters == null) filters = TransactionFilterRequestDTO.builder().build();
        return ResponseEntity.ok(transactionService.filterTransactions(filters));
    }

    @Operation(
            summary = "Get summary of income, expenses, and balance",
            security = @SecurityRequirement(name = "Bearer Authentication"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Summary retrieved successfully",
                            content = @Content(schema = @Schema(implementation = TransactionSummaryDTO.class)))
            }
    )
    @GetMapping("/summary")
    public ResponseEntity<TransactionSummaryDTO> getSummary() throws EntityNotFoundException {
        return ResponseEntity.ok(transactionService.getSummary());
    }

    @Operation(
            summary = "Get monthly total by transaction type",
            security = @SecurityRequirement(name = "Bearer Authentication"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Monthly totals retrieved",
                            content = @Content)
            }
    )
    @GetMapping("/monthly-total/{type}")
    public ResponseEntity<Map<String, BigDecimal>> getMonthlyTotalByType(
            @PathVariable String type) throws EntityInvalidArgumentException, EntityNotFoundException {
        return ResponseEntity.ok(transactionService.getMonthlyTotalByType(type));
    }

    @Operation(
            summary = "Get total expenses grouped by category",
            security = @SecurityRequirement(name = "Bearer Authentication"),
            responses = {
                    @ApiResponse(responseCode = "200", description = "Expense totals retrieved",
                            content = @Content)
            }
    )
    @GetMapping("/expense-total-by-category")
    public ResponseEntity<Map<String, BigDecimal>> getExpenseTotalByCategory() throws EntityNotFoundException {
        return ResponseEntity.ok(transactionService.getExpenseTotalByCategory());
    }
}
