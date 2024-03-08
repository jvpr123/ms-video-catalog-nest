import { EntityNotFoundError } from '../../../domain/errors/not-found.error';
import { Uuid } from '../../../domain/value-objects/uuid.vo';
import { EntityStub } from '../../testing/entity-stub';
import { InMemoryRepository } from './in-memory.repository';

class InMemoryRepositoryStub extends InMemoryRepository<EntityStub, Uuid> {
    getEntity(): new (...args: any[]) => EntityStub {
        return EntityStub;
    }
}

describe('InMemoryRepository Unit Tests', () => {
    let repository: InMemoryRepositoryStub;

    const entities = [
        new EntityStub({ name: 'test_name_a', price: 100 }),
        new EntityStub({ name: 'test_name_b', price: 200 }),
    ];
    const [entityA, entityB] = entities;

    beforeEach(() => repository = new InMemoryRepositoryStub());

    test('should insert a new entity successfully', async () => {
        await repository.insert(entityA);
        expect(repository.items.length).toBe(1);
        expect(repository.items[0]).toBe(entityA);
    });

    test('should bulk insert new entities successfully', async () => {
        await repository.bulkInsert(entities);

        expect(repository.items.length).toBe(2);
        repository.items.forEach((entity: EntityStub , index: number) => {
            expect(entity).toBe(entities[index]);
        })
    })

    test('should update entity successfully', async () => {
        repository.items.push(entityA);

        const entityToUpdate = {
            ...entityA,
            name: 'updated_name',
            price: 500,
        } as EntityStub;

        await repository.update(entityToUpdate);

        expect(repository.items[0]).toBe(entityToUpdate);
    });

    test('shouldn`t update and throw EntityNotFoundError if entity not found', async () => {
        const entityToUpdate = {
            ...entityA,
            name: 'updated_name',
            price: 500,
        } as EntityStub;;

        expect(async () => await repository.update(entityToUpdate))
            .rejects
            .toThrow(EntityNotFoundError);
    });

    test('should delete entity successfully', async () => {
        repository.items.push(entityB);
        expect(repository.items.length).toBe(1);

        await repository.delete(entityB.entity_id);
        expect(repository.items.length).toBe(0);
    });
    
    test('shouldn`t delete and throw EntityNotFoundError if entity not found', async () => {
        expect(async () => await repository.delete(entityB.entity_id))
            .rejects
            .toThrow(EntityNotFoundError);
    });

    test('should find an entity by ID successfully', async () => {
        repository.items.push(entityA);
        expect(await repository.findById(entityA.entity_id)).toBe(entityA);
    });

    test('should return NULL if entity not found by ID', async () => {
        expect(await repository.findById(entityA.entity_id)).toBeNull();
    });

    test('should return array containing all entities successfully', async () => {
        repository.items.push(...entities);

        const output = await repository.findAll();

        expect(output.length).toBe(entities.length);
        output.forEach((entity: EntityStub, index: number) => {
            expect(entity).toBe(entities[index]);
        })
    });

    test('should return empty array if no entity found', async () => {
        const output = await repository.findAll();
        expect(output.length).toBe(0);
    });
});