import { ValueObject } from "../value-objects/ValueObject";

class StringValueObject extends ValueObject {
    constructor (readonly value: string) {
        super()
    }
}

describe('ValueObject Unit Tests', () => {
    test('should be equals', () => {
        const valueObjA = new StringValueObject('test')
        const valueObjB = new StringValueObject('test')

        expect(valueObjA.equals(valueObjB)).toBeTruthy()
    })

    test('shouldn`t be equals', () => {
        const valueObjA = new StringValueObject('test_a')
        const valueObjB = new StringValueObject('test_b')

        expect(valueObjA.equals(valueObjB)).toBeFalsy()
    })
})