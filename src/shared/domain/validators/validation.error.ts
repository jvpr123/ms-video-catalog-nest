import { FieldsErrors } from "./class-validator-fields.interface";

export class EntityValidationError extends Error {
    constructor(public errors: FieldsErrors, public message: string = 'Validation Error') {
        super(message)
    }
}