import { Routes } from '@angular/router';
import { LoginComponent } from '../views/Pages/login/login.component';
import { HomePageComponent } from '../views/Pages/home-page/home-page.component';
import { RegisterComponent } from '../views/Pages/register/register.component';
import { AccessDeniedComponent } from '../views/About/access-denied/access-denied.component';
import { ResetPasswordComponent } from '../views/Pages/reset-password/reset-password.component';
import { CarGridComponent } from '../views/Cars/car-grid/car-grid.component'; 
import { AddCarComponent } from '../views/Cars/add-car/add-car.component';

import { RentedCarsComponent } from '../views/Cars/rented-cars/rented-cars.component';
import { ChangePasswordComponent } from '../views/Pages/change-password/change-password.component';
import { ProfileComponent } from '../views/Pages/profile/profile.component';
import { AuthLoginGuard } from '../guards/auth-login.guard';
import { VerifyEmailComponent } from '../views/Pages/verify-email/verify-email.component';
import { AuthGuard } from '../guards/auth.guard';
import { EditCarComponent } from '../views/Cars/edit-car/edit-car.component';
import { AdminCarComponent } from '../views/Cars/admin-car/admin-car.component';
import { RoleGuard } from '../guards/role.guard';

export const routes: Routes = [
  {
    path: 'home',
    title: 'Trang chủ',
    component: HomePageComponent,
    children: [      
    ]
  },
  {
    path: 'login',
    title: 'Đăng nhập',
    component: LoginComponent,
    canActivate: [AuthLoginGuard]
  },
  {
    path: 'register',
    title: 'Đăng ký',
    component: RegisterComponent,
    canActivate: [AuthLoginGuard]
  },
  {
    path: 'reset-password',
    title: 'Đặt lại mật khẩu',
    component: ResetPasswordComponent,
    canActivate: [AuthLoginGuard]
  },
  {
    path: 'change-password',
    title: 'Thay đổi mật khẩu',
    canActivate: [AuthGuard],
    component: ChangePasswordComponent,
  },
  {
    path: 'profile',
    title: 'Thông tin cá nhân',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'access-denied',
    title: 'Not Found',
    component: AccessDeniedComponent,
  },
  {
    path: 'rented-cars',
    title: 'List Car Rented',
    component: RentedCarsComponent,
    canActivate: [AuthGuard],
    data: {
        roles: ['customer']
    }  
  },
  {
    path: 'car-grid',
    title: 'Car Grid',
    component: CarGridComponent,
    data: {
        roles: ['customer']
    } 
   },
   {
   path: 'add-car',
   title: 'Add Car',
   component: AddCarComponent,
   canActivate: [AuthGuard, RoleGuard] ,
   data: {
    roles: ['admin']
} 
 },
 {
  path: 'edit-car/:carId',
  title: 'Edit Car',
  component: EditCarComponent,
  canActivate: [AuthGuard,RoleGuard],
  data: {
    roles: ['admin']
} 
},
{
  path: 'admin-car',
  title: 'Admin Car',
  component: AdminCarComponent,
  canActivate: [AuthGuard,RoleGuard],
  data: {
    roles: ['admin']
} 
},
   
  {
    path: 'verify-email',
    title: 'Verify Email',
    component: VerifyEmailComponent,
  },
  { path: '', redirectTo: "/home", pathMatch: 'full' },
  { path: '**', redirectTo: "/access-denied" } // Chuyển hướng đến trang access-denied nếu URL không hợp lệ
];
