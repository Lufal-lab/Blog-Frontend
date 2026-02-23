import { AbstractControl, ValidationErrors } from '@angular/forms';

export function noWhitespaceValidator(
  control: AbstractControl
): ValidationErrors | null {


  if (!control.value) {
    return { required: true };
  }

  // Convertimos HTML a texto real
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = control.value;

  const text = tempDiv.textContent || tempDiv.innerText || '';

  if (text.trim().length === 0) {
    return { whitespace: true };
  }

  return null;

  // if (control.value && control.value.trim().length === 0) {
  //   return { whitespace: true };
  // }

  // return null;
}
