import { FieldsErrors } from "./src/shared/domain/validators/class-validator-fields.interface";

declare global {
    namespace jest {
        interface Matchers<R> {
            containsErrorMessage: (expected: FieldsErrors) => R;
        }
    }
}