import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  visible: boolean = false;
  loginPage: boolean = true;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.min(3)]),
  });

  registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor() {}

  login() {
    console.log(this.loginForm.get('email')?.value);
    console.log(this.loginForm.get('password')?.value);
  }

  register() {
    if (this.passwordsMatch()) {
      console.log('uliilflsj');
    }
  }

  passwordsMatch(): boolean {
    return (
      this.registerForm.get('password')?.value ===
      this.registerForm.get('confirmPassword')?.value
    );
  }
}
