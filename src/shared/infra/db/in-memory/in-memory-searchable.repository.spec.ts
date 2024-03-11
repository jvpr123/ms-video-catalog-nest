import { SearchParams } from "../../../domain/repository/search-params";
import { SearchResult } from "../../../domain/repository/search-result";
import { Uuid } from "../../../domain/value-objects/uuid.vo";
import { EntityStub } from "../../testing/entity-stub";
import { InMemorySearchableRepository } from "./in-memory-searchable.repository";

class InMemorySearchableRepositoryStub extends InMemorySearchableRepository<EntityStub, Uuid> {
    sortableFields: string[] = ['name', 'price'];
    items = [
        new EntityStub({ name: 'item_a1', price: 200 }),
        new EntityStub({ name: 'item_a2', price: 100 }),
        new EntityStub({ name: 'item_b1', price: 300 }),
        new EntityStub({ name: 'item_b2', price: 500 }),
        new EntityStub({ name: 'item_a3', price: 400 }),
    ];

    protected async applyFilter(items: EntityStub[], filter: string): Promise<EntityStub[]> {
        if (!filter) return items;

        return items.filter((item: EntityStub) => {
            return (
                item.name.toLowerCase().includes(filter.toLowerCase()) ||
                item.price.toString() === filter
            );
        })
    }

    getEntity(): new (...args: any[]) => EntityStub {
        return EntityStub;
    }
}

describe('Method applyFilter() Unit Tests', () => {
    let repository: InMemorySearchableRepositoryStub;
    
    const entityA = new EntityStub({ name: 'item_a', price: 100 });
    const entityB = new EntityStub({ name: 'item_b', price: 200 });
    const items = [entityA, entityB];

    beforeEach(() => (repository = new InMemorySearchableRepositoryStub()));

    test('should return items with no filter applied when filter param is NULL', async () => {
        const spyFilterMethod = jest.spyOn(items, 'filter' as any);

        const output = await repository['applyFilter'](items, null);
        expect(output).toStrictEqual(items);
        expect(spyFilterMethod).not.toHaveBeenCalled();
    });

    test('should return filtered items according filter param given', async () => {
        const spyFilterMethod = jest.spyOn(items, 'filter' as any);

        const output = await repository['applyFilter'](items, 'a');
        expect(spyFilterMethod).toHaveBeenCalledTimes(1);
        expect(output.length).toBe(1);
        expect(output).toStrictEqual([entityA]);
    });
});

describe('Method applySort() Unit Tests', () => {
    let repository: InMemorySearchableRepositoryStub;

    const items = [
        new EntityStub({ name: 'item_a', price: 200 }),
        new EntityStub({ name: 'item_b', price: 100 }),
        new EntityStub({ name: 'item_c', price: 400 }),
        new EntityStub({ name: 'item_d', price: 300 }),
        new EntityStub({ name: 'item_e', price: 500 }),
    ];

    beforeEach(() => (repository = new InMemorySearchableRepositoryStub()));

    test('should return items with no sort applied when sort param is NULL', () => {
        const output = repository['applySort'](items, null, null);
        expect(output).toStrictEqual(items);
    });

    test('should return items with no sort applied when sort param isn`t included in repository sortable fields', () => {
        const output = repository['applySort'](items, 'invalid_sortable_field', null);
        expect(output).toStrictEqual(items);
    });

    test('should return items sorted according to sort param provided with ASC direction by default', () => {
        const output = repository['applySort'](items, 'price', null);
        output.forEach((item: EntityStub, index: number) => expect(item.price).toBe((index + 1) * 100));
    })

    test('should return items sorted according to sort and sort_dir params provided', () => {
        const output = repository['applySort'](items, 'price', 'desc');
        output.forEach((item: EntityStub, index: number) => expect(item.price).toBe((output.length - index) * 100));
    })
});

describe('Method applyPagination() Unit Tests', () => {
    const items = [
        new EntityStub({ name: 'item_a', price: 100 }),
        new EntityStub({ name: 'item_b', price: 200 }),
        new EntityStub({ name: 'item_c', price: 300 }),
        new EntityStub({ name: 'item_d', price: 400 }),
        new EntityStub({ name: 'item_e', price: 500 }),
    ];

    let repository: InMemorySearchableRepositoryStub;
    let itemsSliceSpy: jest.SpyInstance;
    
    beforeEach(() => {
        repository = new InMemorySearchableRepositoryStub();
        itemsSliceSpy = jest.spyOn(items, 'slice');
    });

    test('should return paginated results with default page and per_page params values', () => {
        const output = repository['applyPagination'](items);

        expect(itemsSliceSpy).toHaveBeenCalledWith(0, 10);
        expect(output.length).toBe(items.length);

        output.forEach((item: EntityStub, index: number) => {
            expect(item.entity_id.equals(items[index].entity_id)).toBe(true);
        });
    });

    test('should return paginated results according to page and per_page params provided', () => {
        const page = 2;
        const per_page = 2;
        const output = repository['applyPagination'](items, page, per_page);

        expect(itemsSliceSpy).toHaveBeenCalledWith(page, page + per_page);
        expect(output.length).toBe(per_page);
        expect(output[0]).toStrictEqual(items[2]);
        expect(output[1]).toStrictEqual(items[3]);
    });
});

describe('Method search() Unit Tests', () => {
    let repository: InMemorySearchableRepositoryStub;
    let applyFilterSpy: jest.SpyInstance;
    let applySortSpy: jest.SpyInstance;
    let applyPaginationSpy: jest.SpyInstance;

    beforeEach(() => {
        repository = new InMemorySearchableRepositoryStub();
        applyFilterSpy = jest.spyOn(repository as any, 'applyFilter');
        applySortSpy = jest.spyOn(repository as any, 'applySort');
        applyPaginationSpy = jest.spyOn(repository as any, 'applyPagination');
    });

    test('should return results filtered, sorted and paginated successfully', async () => {
        const searchParams = new SearchParams({
            page: 1,
            per_page: 2,
            sort: 'price',
            sort_dir: 'desc',
            filter: 'item_a',
        });

        const output = await repository.search(searchParams);

        expect(output).toBeInstanceOf(SearchResult);
        expect(output.items.length).toBe(searchParams.per_page);
        expect(output.total).toBe(3);
        expect(output.current_page).toBe(searchParams.page);
        expect(output.per_page).toBe(searchParams.per_page);
        expect(output.last_page).toBe(2);

        expect(output.items[0]).toStrictEqual(repository.items[4]);
        expect(output.items[1]).toStrictEqual(repository.items[0]);

        expect(applyFilterSpy).toHaveBeenCalledTimes(1);
        expect(applySortSpy).toHaveBeenCalledTimes(1);
        expect(applyPaginationSpy).toHaveBeenCalledTimes(1);
    });
});
