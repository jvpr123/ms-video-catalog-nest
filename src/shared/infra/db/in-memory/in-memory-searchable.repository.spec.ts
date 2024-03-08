import { Uuid } from "../../../domain/value-objects/uuid.vo";
import { EntityStub } from "../../testing/entity-stub";
import { InMemorySearchableRepository } from "./in-memory-searchable.repository";

class InMemorySearchableRepositoryStub extends InMemorySearchableRepository<EntityStub, Uuid> {
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
        new EntityStub({ name: 'item_a', price: 100 }),
        new EntityStub({ name: 'item_b', price: 200 }),
        new EntityStub({ name: 'item_c', price: 300 }),
        new EntityStub({ name: 'item_d', price: 400 }),
        new EntityStub({ name: 'item_e', price: 500 }),
    ];
    const [entityA, entityB, entityC, entityD, entityE] = items;

    beforeEach(() => (repository = new InMemorySearchableRepositoryStub()));
});

describe('Method applyPagination() Unit Tests', () => {
    let repository: InMemorySearchableRepositoryStub;

    const items = [
        new EntityStub({ name: 'item_a', price: 100 }),
        new EntityStub({ name: 'item_b', price: 200 }),
        new EntityStub({ name: 'item_c', price: 300 }),
        new EntityStub({ name: 'item_d', price: 400 }),
        new EntityStub({ name: 'item_e', price: 500 }),
    ];
    const [entityA, entityB, entityC, entityD, entityE] = items;

    beforeEach(() => (repository = new InMemorySearchableRepositoryStub()));
});
