import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from 'src/app/core/services/auth.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { passwordMatchValidator } from 'src/app/shared/validators/password-match.validators';


@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent {

  form!: FormGroup;
  // error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private router: Router,
    private authService: AuthService,

  ){
    this.buildForm();
  }

  register(event: Event){
    event.preventDefault();
    if (this.form.valid) {
      const value = this.form.value;
      this.authService.createUser({email: value.email, password: value.password})
        .subscribe({
          next: () => {
            this.alertService.success(
              'Account created successfully. Please log in.');
            this.router.navigate(['/auth/login']);
          },
          error: (error) => {
            if (error.status === 400 && error.error) {
              const backendErrors = error.error;

              if (backendErrors.email) {
                this.form.get('email')?.setErrors({
                  backend: backendErrors.email
                });
              }

              if (backendErrors.password) {
                this.form.get('password')?.setErrors({
                  backend: backendErrors.password
                });
              }
            }} });
    }
  }

  cancel() {
    this.router.navigate(['/']);
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      Validators: passwordMatchValidator
    });

  }

}




