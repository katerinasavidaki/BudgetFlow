package cf.budgetflow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class BudgetFlowApplication {

	public static void main(String[] args) {
		SpringApplication.run(BudgetFlowApplication.class, args);
	}

}
