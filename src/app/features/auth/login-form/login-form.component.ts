import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
    if (this.form.valid) {
      const value = this.form.value;
      this.authService.login(value)
        .subscribe({
          next: () => {
            this.error = null;
            this.router.navigate(['/posts/']);
          },
          error: (error) => {
            this.error = 'Authentication Error: Wrong username or password';
          }
        })
    }
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





