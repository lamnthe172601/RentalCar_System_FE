import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/;
    
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(passwordPattern)
      ]]
    });
  }

  togglePasswordVisibility(field: 'old' | 'new'): void {
    if (field === 'old') {
      this.showOldPassword = !this.showOldPassword;
    } else {
      this.showNewPassword = !this.showNewPassword;
    }
  }

  isInvalid(fieldName: string): boolean {
    const field = this.changePasswordForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFormError(fieldName: string): string {
    const control = this.changePasswordForm.get(fieldName);
    if (control && control.errors) {
      if (control.errors['required']) {
        return fieldName === 'oldPassword' ? 
          'Vui lòng nhập mật khẩu cũ' : 
          'Vui lòng nhập mật khẩu mới';
      }
      if (control.errors['minlength']) {
        return 'Mật khẩu phải có ít nhất 8 ký tự';
      }
      if (control.errors['pattern']) {
        return 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt';
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const { oldPassword, newPassword } = this.changePasswordForm.value;
      this.authService.changePassword(oldPassword, newPassword).subscribe({
        next: () => {
          this.successMessage = 'Đổi mật khẩu thành công';
          this.errorMessage = null;
          
          // Add delay before logout and navigation
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/login'], { 
              queryParams: { passwordChanged: 'success' } 
            });
          }, 2000); // 2 second delay
        },
        error: (error) => {
          this.successMessage = null;
          this.errorMessage = error.error.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.';
        }
      });
    } else {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin.';
    }
  }
}
