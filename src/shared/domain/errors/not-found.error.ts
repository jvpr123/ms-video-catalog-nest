import { Entity } from "../entity";

export class EntityNotFoundError extends Error {
    constructor(id: any[] | any, entity: new (...args: any[]) => Entity) {
        Array.isArray(id)
            ? super(`${entity.name} not found using ID's ${id.join(", ")}`)
            : super(`${entity.name} not found using ID ${id}`);

            this.name = 'Entity Not Found Error';
    }
}