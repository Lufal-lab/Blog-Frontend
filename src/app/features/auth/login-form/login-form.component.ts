import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { AlertService } from 'src/app/core/services/alert.service';

import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent {

  form!: FormGroup;
  error: string | null = null;

  hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private alertService: AlertService
  ){
    this.buildForm();
  }

  login(event: Event){
    event.preventDefault();

    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Para mostrar errores visuales si el usuario da clic sin llenar
      return;
    }

    this.error = null; // Reset de error local

    // Usamos getRawValue() para evitar problemas con campos deshabilitados
    const credentials = this.form.getRawValue();

    this.authService.login(credentials).subscribe({
      next: () => {
        this.alertService.success(
              'Successful login');
        this.router.navigate(['/posts']);
      },
      error: (err: HttpErrorResponse) => {
        // Manejo específico de credenciales incorrectas
        if (err.status === 400 || err.status === 401) {
          this.error = 'User or password incorrect. Please try again.';
        } else {
          // El ErrorInterceptor se encarga de los 0, 500, etc.
          this.error = null;
        }
      }
    });
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

    cancel() {
    this.router.navigate(['/']);
  }



}





