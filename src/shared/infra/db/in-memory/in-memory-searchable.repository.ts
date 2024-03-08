import { Entity } from "../../../domain/entity";
import { SearchParams, SortDirection } from '../../../domain/repository/search-params';
import { SearchResult } from '../../../domain/repository/search-result';
import { ISearchableRepository } from "../../../domain/repository/searchable-repository.interface";
import { ValueObject } from "../../../domain/value-objects/ValueObject";
import { InMemoryRepository } from "./in-memory.repository";

export abstract class InMemorySearchableRepository<E extends Entity, EntityId extends ValueObject, Filter = string>
    extends InMemoryRepository<E, EntityId>
    implements ISearchableRepository<E, EntityId, Filter> {
    sortableFields: string[] = [];

    async search(props: SearchParams<Filter>): Promise<SearchResult<E>> {
        const filteredItems = await this.applyFilter(this.items, props.filter);
        const sortedItems = this.applySort(filteredItems, props.sort, props.sort_dir);
        const paginatedItems = this.applyPagination(sortedItems, props.page, props.per_page);

        return new SearchResult({
            items: paginatedItems,
            total: filteredItems.length,
            current_page: props.page,
            per_page: props.per_page
        });
    }

    protected abstract applyFilter(items: E[], filter: Filter | null): Promise<E[]>;

    protected applySort(
        items: E[],
        sort: string | null,
        sort_dir: SortDirection | null,
        custom_getter?: (sort: string, item: E) => any
    ): E[] {
        if (!sort || !this.sortableFields.includes(sort)) {
            return items;
        }

        return [...items].sort((a, b) => {
            // @ts-ignore
            const valueA = custom_getter ? custom_getter(sort, a) : a[sort];
            // @ts-ignore
            const valueB = custom_getter ? custom_getter(sort, b) : b[sort];

            if (valueA < valueB) return sort_dir === 'asc' ? -1 : 1;
            if (valueA > valueB) return sort_dir === 'asc' ? 1 : -1;

            return 0;
        });
    }

    protected applyPagination(items: E[], page: SearchParams<Filter>['page'], per_page: SearchParams<Filter>['per_page']): E[] {
        const start = (page - 1) * per_page;
        const limit = start + per_page;

        return items.slice(start, limit);
    }
}