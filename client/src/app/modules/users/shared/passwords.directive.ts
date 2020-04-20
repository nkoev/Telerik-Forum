import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

export const passwordsValidator: ValidatorFn = (
  control: FormGroup
): ValidationErrors | null => {
  const pass = control.get('password');
  const confirm = control.get('confirmPassword');

  return pass && confirm && pass.value === confirm.value
    ? null
    : { notSame: true };
};
