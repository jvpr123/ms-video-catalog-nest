import { InvalidUuidError, Uuid } from "../uuid.vo"
import { v4 as uuidv4 } from 'uuid';

describe('UUID Unit Tests', () => {
    const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate')

    test('should throw exception if invalid UUID is provided', () => {
        expect(() => new Uuid('invalid_uuid')).toThrow(InvalidUuidError)
        expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    test('should create if valid UUID is provided successfully', () => {
        const uuid = new Uuid(uuidv4())
        expect(uuid.id).toBeDefined()
        expect(validateSpy).toHaveBeenCalledTimes(1)
    })

    test('should generate valid UUID if not provided successfully', () => {
        const uuid = new Uuid()
        expect(uuid.id).toBeDefined()
        expect(validateSpy).toHaveBeenCalledTimes(1)
    })
})