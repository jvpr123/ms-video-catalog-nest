import { ValueObject } from "../ValueObject";
import { v4 as uuidv4, validate as validateUuid } from 'uuid'

export class Uuid extends ValueObject {
    readonly id: string;

    constructor(id?: string) {
        super()
        this.id = id ?? uuidv4()
        this.validate()
    }

    private validate(): void {
        if (!validateUuid(this.id)) {
            throw new InvalidUuidError()
        }
    }
}

export class InvalidUuidError extends Error {
    constructor(message?: string) {
        super(message || 'ID must be a valid UUID')
        this.name = 'InvalidUuidError'
    }
}