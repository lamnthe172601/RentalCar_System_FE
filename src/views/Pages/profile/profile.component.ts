import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../api/api.service';
import { UserProfile } from 'firebase/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile = {} as UserProfile;
  profileForm!: FormGroup;
  avatarUrl: string = 'assets/images/default-profile.png';
  errorMessage: string | null = null;
  successMessage: string | null = null;
  editMode: boolean = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      phoneNumber: ['', [
        Validators.required, 
        Validators.pattern(/^[0-9]{10}$/)
      ]]
    });
  }

  getErrorMessage(field: string): string {
    const control = this.profileForm.get(field);
    if (control?.errors) {
      if (control.errors['required']) {
        return `Vui lòng nhập ${field === 'name' ? 'họ tên' : 'số điện thoại'}`;
      }
      if (control.errors['pattern']) {
        return 'Số điện thoại phải có 10 chữ số';
      }
    }
    return '';
  }

  ngOnInit(): void {
    this.loadProfile();
    this.loadAvatar();
  }

  private loadProfile(): void {
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        if (this.editMode) {
          this.profileForm.patchValue({
            name: profile.name,
            phoneNumber: profile.phoneNumber
          });
        }
      },
      error: (error) => {
        this.errorMessage = error.error.message;
      }
    });
  }

  private loadAvatar(): void {
    this.authService.getAvatar().subscribe({
      next: (blob) => {
        this.avatarUrl = URL.createObjectURL(blob);
      },
      error: () => {
        this.avatarUrl = 'assets/images/default-profile.png';
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.authService.uploadAvatar(file).subscribe({
        next: () => {
          this.loadAvatar();
          this.showMessage('Cập nhật ảnh đại diện thành công', true);
        },
        error: (error) => {
          this.showMessage(error.error.message || 'Cập nhật ảnh đại diện thất bại', false);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      const { name, phoneNumber } = this.profileForm.value;
      this.authService.updateProfile(name, phoneNumber).subscribe({
        next: () => {
          this.loadProfile();
          this.editMode = false;
          this.showMessage('Cập nhật thông tin thành công', true);
        },
        error: (error) => {
          this.showMessage(error.error.message || 'Cập nhật thông tin thất bại', false);
        }
      });
    }
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.profileForm.patchValue({
        name: this.userProfile['name'],
        phoneNumber: this.userProfile['phoneNumber']
      });
    }
  }

  private showMessage(message: string, isSuccess: boolean): void {
    if (isSuccess) {
      this.successMessage = message;
      this.errorMessage = null;
    } else {
      this.errorMessage = message;
      this.successMessage = null;
    }
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 3000);
  }
}