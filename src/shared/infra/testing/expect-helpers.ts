import { ClassValidatorFields } from "../../domain/validators/class-validator-fields";
import { FieldsErrors } from "../../domain/validators/class-validator-fields.interface";
import { EntityValidationError } from "../../domain/validators/validation.error";

type Expected = | { validator: ClassValidatorFields<any>; data: any } | (() => any)

expect.extend({
    containsErrorMessage(expected: Expected, received: FieldsErrors) {
        if (typeof expected === "function") {
            try {
                expected();
                return isValid();
            } catch (err) {
                const error = err as EntityValidationError;
                return assertContainsErrorMessages(error.errors, received);
            }
        } else {
            const { validator, data } = expected;
            const validated = validator.validate(data)

            if (validated) return isValid();
        }
    }
});

function isValid() {
    return { pass: true, message: () => '' };
}

function assertContainsErrorMessages(expected: FieldsErrors, received: FieldsErrors) {
    const isMatch = expect.objectContaining(received).asymmetricMatch(expected);

    return isMatch ? isValid() : {
        pass: false,
        message: () => `Validation errors don't contain ${JSON.stringify(received)}. Current: ${JSON.stringify(expected)}`
    };
}
