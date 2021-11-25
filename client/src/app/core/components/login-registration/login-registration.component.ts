import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Result } from '../../models/result.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-registration',
  templateUrl: './login-registration.component.html',
  styleUrls: ['./login-registration.component.scss'],
})
export class LoginRegistrationComponent {
  visible: boolean = false;
  confirmVisible: boolean = false;
  loginPage: boolean = true;
  newImage: FileList | null = null;

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.min(3)]),
  });

  registerForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  constructor(
    private authService: AuthService,
    private dialogRef: MatDialogRef<LoginRegistrationComponent>,
    private _snackBar: MatSnackBar
  ) {}

  login() {
    this.authService
      .login(
        this.loginForm.get('username')?.value,
        this.loginForm.get('password')?.value
      )
      .subscribe((res) => {
        if (res.success) {
          this.dialogRef.close();
          this.alert('Logged in');
          this.authService.setLoginEvent();
        } else {
          this.alert('Invalid credentials');
        }
      });
  }

  register() {
    if (!this.registerForm.get('email')?.valid) {
      this.alert('Email is invalid');
    } else if (!this.registerForm.get('username')?.valid) {
      this.alert('Username is invalid');
    } else if (!this.registerForm.get('password')?.valid) {
      this.alert('Password is too short');
    } else if (
      this.registerForm.get('password')?.value !==
      this.registerForm.get('confirmPassword')?.value
    ) {
      this.alert("Passwords don't match");
    } else {
      this.authService
        .register(
          this.registerForm.get('email')?.value,
          this.registerForm.get('username')?.value,
          this.registerForm.get('password')?.value
        )
        .subscribe((res) => this.handleResponse(res));
    }
  }

  onImageChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    this.newImage = element.files;
  }

  private handleResponse(res: Result) {
    if (res.success && res.userId) {
      this.setImage(res.userId);
      this.loginPage = true;
      this.alert('Registration completed');
      this.registerForm.reset();
      this.visible = false;
      this.confirmVisible = false;
    } else if (res.status === 403) {
      this.alert('Email already in use');
    } else if (res.status === 400) {
      this.alert('Password is not strong enough');
    } else if (res.status === 404) {
      this.alert('Username is already in use');
    }
  }

  private setImage(userId: string) {
    if (this.newImage?.length === 1) {
      this.authService.setImage(this.newImage[0], userId).subscribe();
    }
  }

  private alert(message: string) {
    this._snackBar.open(message, 'close', {
      duration: 3000,
    });
  }
}
