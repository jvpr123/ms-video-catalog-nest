import { Entity } from "../../domain/entity";
import { Uuid } from "../../domain/value-objects/uuid.vo";

export type EntityConstructorStubProps = {
    entity_id?: Uuid;
    name: string;
    price: number;
}

export class EntityStub extends Entity {
    entity_id: Uuid;
    name: string;
    price: number;

    constructor(props: EntityConstructorStubProps) {
        super();
        this.entity_id = props.entity_id || new Uuid();
        this.name = props.name;
        this.price = props.price;
    }

    toJSON() {
        return {
            entity_id: this.entity_id.id,
            name: this.name,
            price: this.price,
        }
    }
}