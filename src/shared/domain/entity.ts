import { ValueObject } from "./value-objects/ValueObject";

export abstract class Entity {
    abstract get entity_id(): ValueObject;
    abstract toJSON(): any;
}