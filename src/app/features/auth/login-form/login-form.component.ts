import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

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
    private router: Router
  ){
    this.buildForm();
  }

  login(event: Event){
    event.preventDefault();
    // if (this.form.valid) {
    //   const { email, password } = this.form.value;
    //   this.authService.login({ email, password })
    //     .subscribe({
    //       next: () => {
    //         this.error = null;
    //         this.router.navigate(['/posts/']);
    //       },
    //       error: (error: HttpErrorResponse) => {
    //       // 1. Error Local: Si el servidor responde 400 o 401, el problema son los datos
    //       if (error.status === 400 || error.status === 401) {
    //         this.error = 'User or password incorrect. Please try again.';
    //       }
    //       // 2. Error Global: Si es Status 0 o 500, el componente NO pone mensaje,
    //       // porque el ErrorInterceptor ya sacó la alerta del AlertService automáticamente.
    //       else {
    //         this.error = null;
    //       }}

    //       // error: (error) => {
    //       //   this.error = 'Authentication Error: Wrong username or password';
    //       // }

    //     })
    // }

    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Para mostrar errores visuales si el usuario da clic sin llenar
      return;
    }

    this.error = null; // Reset de error local

    // Usamos getRawValue() para evitar problemas con campos deshabilitados
    const credentials = this.form.getRawValue();

    this.authService.login(credentials).subscribe({
      next: () => {
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





