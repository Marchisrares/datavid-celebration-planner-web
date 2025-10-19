import { AbstractControl, ValidationErrors } from '@angular/forms';

export function atLeast18(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string; // 'YYYY-MM-DD'
  if (!value) return { required: true };

  const [y, m, d] = value.split('-').map((n) => +n);
  const birth = new Date(Date.UTC(y, m - 1, d));
  const today = new Date();
  const eighteen = new Date(
    Date.UTC(today.getUTCFullYear() - 18, today.getUTCMonth(), today.getUTCDate())
  );

  return birth > eighteen ? { underage: true } : null;
}
