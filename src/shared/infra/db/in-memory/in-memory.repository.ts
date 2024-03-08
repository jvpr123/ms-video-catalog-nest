import { Entity } from "../../../domain/entity";
import { EntityNotFoundError } from "../../../domain/errors/not-found.error";
import { IRepository } from "../../../domain/repository/repository.interface";
import { ValueObject } from "../../../domain/value-objects/ValueObject";

export abstract class InMemoryRepository<E extends Entity, EntityId extends ValueObject> implements IRepository<E, EntityId> {
    public items: E[] = [];

    async insert(entity: E): Promise<void> {
        this.items.push(entity);
    }

    async bulkInsert(entities: E[]): Promise<void> {
        this.items.push(...entities);
    }

    async update(entity: E): Promise<void> {
        const index = this.items.findIndex((item: E) => item.entity_id.equals(entity.entity_id));
        if (index === -1) {
            throw new EntityNotFoundError(entity.entity_id, this.getEntity());
        }

        this.items[index] = entity;
    }

    async delete(entity_id: EntityId): Promise<void> {
        const index = this.items.findIndex((item: E) => item.entity_id.equals(entity_id));
        if (index === -1) {
            throw new EntityNotFoundError(entity_id, this.getEntity());
        }

        this.items.splice(index, 1);
    }

    async findById(entity_id: EntityId): Promise<E | null> {
        const item = this.items.find((item: E) => item.entity_id.equals(entity_id));
        return typeof item === "undefined" ? null : item;
    }

    async findAll(): Promise<E[]> {
        return this.items;
    }

    abstract getEntity(): new (...args: any[]) => E;
}