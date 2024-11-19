import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/;

    this.registerForm = this.fb.group({
      name: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(passwordPattern)]],
    });
  }

  isInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  getFormError(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (control && control.errors) {
      if (control.errors['required']) {
        switch(fieldName) {
          case 'name': return 'Vui lòng nhập họ tên';
          case 'email': return 'Vui lòng nhập email';
          case 'phoneNumber': return 'Vui lòng nhập số điện thoại';
          case 'password': return 'Vui lòng nhập mật khẩu';
          default: return 'Trường này là bắt buộc';
        }
      }
      if (control.errors['email']) {
        return 'Email không hợp lệ';
      }
      if (control.errors['pattern']) {
        if (fieldName === 'phoneNumber') {
          return 'Số điện thoại phải có 10 chữ số';
        }
        return 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt';
      }
      if (control.errors['minlength']) {
        return 'Mật khẩu phải có ít nhất 8 ký tự';
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { name, email, phoneNumber, password } = this.registerForm.value;
      this.authService.signup(name, email, phoneNumber, password).subscribe({
        next: () => {
          this.successMessage = 'Đăng ký thành công';
          this.errorMessage = null;
          localStorage.removeItem("token");
          this.router.navigate(['/login'], { queryParams: { registered: 'success' } });
        },
        error: (error) => {
          this.successMessage = null;
          this.errorMessage = error.error.message || 'Đăng ký thất bại. Vui lòng thử lại.';
        }
      });
    } else {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin.';
    }
  }
}
