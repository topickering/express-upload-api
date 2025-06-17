import { describe, it, expect } from 'vitest';
import mockValidateEmail from "./mock-validate-email.js";

describe('mockValidateEmail', () => {
    it('resolves to true if email is valid', async () => {
        const result = await mockValidateEmail('valid@email.com')
        expect(result).toEqual({ valid: true });
    });

    it('resolves to false if email is invalid', async () => {
        const result = await mockValidateEmail('invalidemail')
        expect(result).toEqual({ valid: false });
    })
})