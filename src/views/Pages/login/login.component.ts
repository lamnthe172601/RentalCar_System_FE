import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterOutlet, RouterLinkActive, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['passwordChanged'] === 'success') {
        this.successMessage = 'Đổi mật khẩu thành công. Vui lòng đăng nhập với mật khẩu mới.';
      }
      if (params['registered'] === 'success') {
        this.successMessage = 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.';
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  isInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getFormError(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.errors) {
      if (control.errors['required']) {
        return `Vui lòng nhập ${fieldName === 'email' ? 'email' : 'mật khẩu'}`;
      }
      if (control.errors['email']) {
        return 'Email không hợp lệ';
      }
      if (control.errors['minlength']) {
        return 'Mật khẩu phải có ít nhất 6 ký tự';
      }
    }
    return '';
  }

  hideMessages(): void {
    this.errorMessage = null;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.successMessage = 'Đăng nhập thành công';
          this.errorMessage = null;
          localStorage.setItem("token", response.token);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.successMessage = null;
          this.errorMessage = error.error.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
        }
      });
    } else {
      this.errorMessage = 'Vui lòng điền đầy đủ thông tin.';
    }
  }
}
