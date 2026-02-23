import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordMatchValidator(
  control: AbstractControl
): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword');

  if (!password || !confirm) {
    return null;
  }

  // Si no coinciden, asignamos el error al control confirmPassword
  if (password !== confirm.value) {
    confirm.setErrors({ passwordMismatch: true });
  } else {
    // Limpiamos otros errores que no sean backend
    const errors = confirm.errors;
    if (errors) {
      delete errors['passwordMismatch'];
      if (Object.keys(errors).length === 0) {
        confirm.setErrors(null);
      } else {
        confirm.setErrors(errors);
      }
    }
  }

  return null;
}
