import { describe, it, expect } from 'vitest';
import { validateLogin, validateRegister } from './validation';

/** Empty email should fail */
describe('validateLogin', () => {
  it('should return error if email is empty', () => {
    const result = validateLogin({
      email: '',
      password: '12345678',
    });
    expect(result).toBeTruthy();
  });

  /** Invalid email should fail */
  it('should fail if email is not stud.noroff.no', () => {
    const result = validateLogin({
      email: 'test@gmail.com',
      password: '12345678',
    });
    expect(result).toContain('stud.noroff.no');
  });

  /** Password to short */
  it('should fail if password is too short', () => {
    const result = validateLogin({
      email: 'test@stud.noroff.no',
      password: '123',
    });
    expect(result).toBeTruthy();
  });

  /** Valid login */
  it('should pass with valid credentials', () => {
    const result = validateLogin({
      email: 'test@stud.noroff.no',
      password: '12345678',
    });
    expect(result).toBeNull();
  });
});

/** Username with invalid characters */
describe('validateRegister', () => {
  it('should fail if username contains invalid characters', () => {
    const result = validateRegister({
      name: 'ola!',
      email: 'ola@stud.noroff.no',
      password: '12345678',
    });
    expect(result).toMatch(/username/i);
  });

  /** Email must be Noroff */
  it('should fail if email is not Noroff', () => {
    const result = validateRegister({
      name: 'ola_nor',
      email: 'ola@gmail.com',
      password: '12345678',
    });
    expect(result).toContain('stud.noroff.no');
  });

  /** Password too short */
  it('should fail if password is less than 8 characters', () => {
    const result = validateRegister({
      name: 'ola_nor',
      email: 'ola@stud.noroff.no',
      password: '123',
    });
    expect(result).toBeTruthy();
  });

  /** Valid register */
  it('should pass with valid input', () => {
    const result = validateRegister({
      name: 'ola_nor',
      email: 'ola@stud.noroff.no',
      password: '12345678',
    });
    expect(result).toBeNull();
  });
});
