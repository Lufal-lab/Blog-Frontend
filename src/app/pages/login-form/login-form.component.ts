import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.sass']
})
export class LoginFormComponent {

  form!: FormGroup;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ){
    this.buildForm();
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    })
  }

  submit() {
    if (this.form.invalid) return;

    this.authService.login(this.form.value).subscribe({
      next: () => {
        console.log('Login exitoso');
      },
      error: () => {
        this.error = 'Credenciales inválidas';
      }
    });
  }

}
