import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { first } from 'rxjs';


@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  constructor(private http: HttpClient, private router: Router) { }

  emailError: string | null = null;

  userForm: FormGroup = new FormGroup(
    {
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Za-z]+$/),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[A-Za-z]+$/),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        this.docquityEmailValidator,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
        ),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/), // Ensure mobile number is exactly 10 digits
      ]),
    },
    { validators: this.passwordMatchValidator }
  );

  docquityEmailValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    return email && email.endsWith('@docquity.com')
      ? null
      : { invalidEmailDomain: true };
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }


  onUserSave() {
    if (this.userForm.valid) {
      const formData = {
        firstname: this.userForm.value.firstName,
        lastname: this.userForm.value.lastName,
        email: this.userForm.value.email,
        password: this.userForm.value.password,
        mobile_number: this.userForm.value.mobile,
      };

      this.http.post("http://localhost:3000/auth/signup", formData).subscribe({
        next: (res: any) => {
          console.log("Signup successful", res);
          this.emailError = null;  // Clear the email error on successful signup
          alert('Signup successful');

          this, this.emailError = null;

          // Redirect to login page
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          // Handle error when the email already exists
          if (error.status === 409 && error.error.field === 'email') {
            this.emailError = 'Email ID already exists.';
          } else {
            this.emailError = 'An error occurred during signup. Please try again.';
          }
        }
      });
    } else {
      console.log('Form is invalid');
      // Handle invalid form (e.g., show error for form validation)
      this.emailError = 'Please fill in all required fields correctly.';
    }
  }
}