import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent {
  emailError: string | null = null;
  passwordError: string | null = null;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    if (this.loginForm.valid) {
      const formData = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password,
      };
  
      console.log(formData);
  
      // Clear existing error messages
      this.emailError = '';
      this.passwordError = '';
  
      this.http.post("http://localhost:3000/auth/login", formData).subscribe({
        next: (res: any) => {
          console.log("Login successful", res);
  
          // Store the access token in sessionStorage
          if (res.access_token) {
            localStorage.setItem('access_token', res.access_token);
            console.log('Token stored in sessionStorage');
          }
  
          // Redirect to the dashboard after successful login
          this.router.navigate(['/dashboard']);
        },
        error: (error: any) => {
          // Handle error responses for email and password
          if (error.status === 400) {
            if (error.error.field === 'email') {
              this.emailError = error.error.message;
            } else if (error.error.field === 'password') {
              this.passwordError = error.error.message;
            }
          } else {
            this.emailError = 'An unexpected error occurred. Please try again later.';
          }
        }
        
      });
    } else {
      console.log('Form is invalid');
      this.emailError = 'Please fill in all required fields correctly.';
    }
  }  
}
