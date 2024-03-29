import { EntityStub } from '../../infra/testing/entity-stub';
import { SearchResult } from './search-result';

describe('SearchResult Unit Tests', () => {
    const entityA = new EntityStub({ name: 'item_a', price: 100 });
    const entityB = new EntityStub({ name: 'item_b', price: 200 });
    const entities = [entityA, entityB];

    const results = new SearchResult({
        items: entities as any,
        total: 10,
        current_page: 1,
        per_page: 2
    });

    test('should return search results successfully', () => {
        expect(results.items).toBe(entities);
        expect(results.total).toBe(10);
        expect(results.current_page).toBe(1);
        expect(results.per_page).toBe(2);
        expect(results.last_page).toBe(Math.ceil(results.total / results.per_page));
    });

    test('should convert to JSON not forcing items serialization', () => {
        expect(results.toJSON(false)).toStrictEqual({
            items: entities,
            total: results.total,
            current_page: results.current_page,
            per_page: results.per_page,
            last_page: results.last_page
        })
    });

    test('should convert to JSON forcing items serialization', () => {
        expect(results.toJSON(true)).toStrictEqual({
            items: [
                { entity_id: entityA.entity_id.id, name: entityA.name, price: entityA.price },
                { entity_id: entityB.entity_id.id, name: entityB.name, price: entityB.price },
            ],
            total: results.total,
            current_page: results.current_page,
            per_page: results.per_page,
            last_page: results.last_page
        })
    });
});
