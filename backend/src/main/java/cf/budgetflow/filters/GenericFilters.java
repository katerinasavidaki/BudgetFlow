package cf.budgetflow.filters;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public abstract class GenericFilters {

    private static final int DEFAULT_PAGE_SIZE = 10;
    private static final String DEFAULT_SORT_COLUMN = "id";
    private static final Sort.Direction DEFALUT_SORT_DIRECTION = Sort.Direction.ASC;

    private int page;
    private int pageSize;
    private Sort.Direction sortDirection;
    private String sortBy;

    public int getPage() {
        return Math.max(page, 0);
    }

    public int getPageSize() {
        return pageSize < 0 ? DEFAULT_PAGE_SIZE : pageSize;
    }

    public Sort.Direction getSortDirection() {
        if (sortDirection == null) {
            return DEFALUT_SORT_DIRECTION;
        } else {
            return sortDirection;
        }
    }

    public String getSortBy() {
        if (sortBy == null || sortBy.isBlank()) return DEFAULT_SORT_COLUMN;
        return sortBy;
    }

    public Sort getSort() {
        return Sort.by(getSortDirection(), getSortBy());
    }

    public Pageable getPageable() {
        return PageRequest.of(getPage(), getPageSize(), getSort());
    }

    @Override
    public String toString() {
        return "GenericFilters{" +
                "page=" + page +
                ", pageSize=" + pageSize +
                ", sortDirection=" + sortDirection +
                ", sortBy='" + sortBy + '\'' +
                '}';
    }
}
