import { isEqual } from 'lodash'

export abstract class ValueObject {
    equals(vo: this): boolean {
        if (vo === null) {
            return false
        }

        if (vo.constructor.name !== this.constructor.name) {
            return false
        }

        return isEqual(vo, this)
    }
}