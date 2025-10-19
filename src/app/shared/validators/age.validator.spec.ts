import { FormControl } from '@angular/forms';
import { atLeast18 } from './age.validator';

describe('atLeast18 validator', () => {
  it('should return null for valid age (18+)', () => {
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 20);
    const dateString = birthDate.toISOString().split('T')[0];
    const control = new FormControl(dateString);

    const result = atLeast18(control);

    expect(result).toBeNull();
  });

  it('should return null for exactly 18 years old', () => {
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 18);
    const dateString = birthDate.toISOString().split('T')[0];
    const control = new FormControl(dateString);

    const result = atLeast18(control);

    expect(result).toBeNull();
  });

  it('should return underage error for age < 18', () => {
    const birthDate = new Date();
    birthDate.setFullYear(birthDate.getFullYear() - 17);
    const dateString = birthDate.toISOString().split('T')[0];
    const control = new FormControl(dateString);

    const result = atLeast18(control);

    expect(result).toEqual({ underage: true });
  });

  it('should return required error for empty value', () => {
    const control = new FormControl('');

    const result = atLeast18(control);

    expect(result).toEqual({ required: true });
  });

  it('should return required error for null value', () => {
    const control = new FormControl(null);

    const result = atLeast18(control);

    expect(result).toEqual({ required: true });
  });

  it('should validate 25 years old person', () => {
    const control = new FormControl('2000-01-01');
    const result = atLeast18(control);
    expect(result).toBeNull();
  });

  it('should validate edge case: person born today 18 years ago', () => {
    const today = new Date();
    const birthDate = new Date(today);
    birthDate.setFullYear(birthDate.getFullYear() - 18);
    const dateString = birthDate.toISOString().split('T')[0];
    const control = new FormControl(dateString);

    const result = atLeast18(control);

    expect(result).toBeNull();
  });

  it('should invalidate person born tomorrow 18 years ago', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setFullYear(tomorrow.getFullYear() - 18);
    const dateString = tomorrow.toISOString().split('T')[0];
    const control = new FormControl(dateString);

    const result = atLeast18(control);

    expect(result).toEqual({ underage: true });
  });
});
