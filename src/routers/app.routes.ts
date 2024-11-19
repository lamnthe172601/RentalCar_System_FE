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

export const routes: Routes = [
  {
    path: 'home',
    title: 'Home',
    component: HomePageComponent,
    children: [      
    ]
  },
  {
    path: 'login',
    title: 'login',
    component: LoginComponent,
    canActivate: [AuthLoginGuard]
  },
  {
    path: 'register',
    title: 'Register',
    component: RegisterComponent,
    canActivate: [AuthLoginGuard]
  },
  {
    path: 'reset-password',
    title: 'Reset Password',
    component: ResetPasswordComponent,
    canActivate: [AuthLoginGuard]
  },
  {
    path: 'change-password',
    title: 'Change Password',
    canActivate: [AuthGuard],
    component: ChangePasswordComponent,
  },
  {
    path: 'profile',
    title: 'Profile',
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
   canActivate: [AuthGuard] ,
   data: {
    roles: ['admin']
} 
 },
 {
  path: 'edit-car/:carId',
  title: 'Edit Car',
  component: EditCarComponent,
  canActivate: [AuthGuard],
  data: {
    roles: ['admin']
} 
},
{
  path: 'admin-car',
  title: 'Admin Car',
  component: AdminCarComponent,
  canActivate: [AuthGuard],
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
