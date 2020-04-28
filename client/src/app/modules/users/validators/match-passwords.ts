import { ValidatorFn, FormGroup, ValidationErrors } from '@angular/forms';

export const passwordsValidator: ValidatorFn = (
  control: FormGroup
): ValidationErrors | null => {
  const pass = control.get('password');
  const confirm = control.get('confirmPassword');

  if (pass && confirm && pass.value === confirm.value) {
    return null;
  } else {
    confirm.setErrors({ notSame: true });
  }
};
