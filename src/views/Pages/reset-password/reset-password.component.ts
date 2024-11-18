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
  resetPasswordForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  showPassword: boolean = false;
  isResetMode: boolean = false;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['token']) {
        this.isResetMode = true;
      }
    });
  }

  getFormError(fieldName: string): string {
    const control = this.resetPasswordForm.get(fieldName);
    if (control?.errors) {
      if (control.errors['required']) {
        return fieldName === 'email' ? 'Vui lòng nhập email' : 'Vui lòng nhập mật khẩu mới';
      }
      if (control.errors['email']) {
        return 'Email không hợp lệ';
      }
      if (control.errors['minlength']) {
        return 'Mật khẩu phải có ít nhất 8 ký tự';
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      if (this.isResetMode) {
        const token = this.route.snapshot.queryParams['token'];
        const newPassword = this.resetPasswordForm.get('newPassword')?.value;
        
        this.authService.resetPassword(token, newPassword).subscribe({
          next: () => {
            this.successMessage = 'Đổi mật khẩu thành công';
            this.errorMessage = null;
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          },
          error: (error) => {
            this.errorMessage = error.error.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại';
            this.successMessage = null;
          }
        });
      } else {
        const email = this.resetPasswordForm.get('email')?.value;
        this.authService.forgotPassword(email).subscribe({
          next: () => {
            this.successMessage = 'Link đặt lại mật khẩu đã được gửi đến email của bạn';
            this.errorMessage = null;
          },
          error: (error) => {
            this.errorMessage = error.error.message || 'Gửi yêu cầu thất bại. Vui lòng thử lại';
            this.successMessage = null;
          }
        });
      }
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  isInvalid(fieldName: string): boolean {
    const field = this.resetPasswordForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}
