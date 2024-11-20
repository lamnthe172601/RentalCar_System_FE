import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isResetMode = false;
  token: string | null = null;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
      this.isResetMode = !!this.token;
      this.initForm();
    });
  }
  private initForm(): void {
    if (this.isResetMode) {
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/;
      this.resetForm = this.fb.group({
        newPassword: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(passwordPattern)
        ]]
      });
    } else {
      this.resetForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]]
      });
    }
  }
  onSubmit(): void {
    if (this.resetForm.valid) {
      if (this.isResetMode) {
        this.handleResetPassword();
      } else {
        this.handleForgotPassword();
      }
    }
  }
  private handleForgotPassword(): void {
    const { email } = this.resetForm.value;
    this.authService.forgotPassword(email).subscribe({
      next: (response) => {
        this.successMessage = response.message;
        this.errorMessage = null;
      },
      error: (error) => {
        this.errorMessage = error.error.message;
        this.successMessage = null;
      }
    });
  }
  private handleResetPassword(): void {
    const { newPassword } = this.resetForm.value;
    if (this.token) {
      this.authService.resetPassword(this.token, newPassword).subscribe({
        next: (response) => {
          this.successMessage = response.message;
          this.errorMessage = null;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.errorMessage = error.error.message;
          this.successMessage = null;
        }
      });
    }
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  isInvalid(fieldName: string): boolean {
    const field = this.resetForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
  getFormError(fieldName: string): string {
    const control = this.resetForm.get(fieldName);
    if (control && control.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['email']) return 'Invalid email format';
      if (control.errors['minlength']) return 'Password must be at least 8 characters';
      if (control.errors['pattern']) {
        return 'Password must contain uppercase, lowercase, number and special character';
      }
    }
    return '';
  }
}