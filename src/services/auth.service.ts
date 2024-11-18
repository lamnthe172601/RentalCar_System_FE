import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { catchError, Observable, throwError, tap } from 'rxjs';
import { Router } from '@angular/router';
import { Auth, GoogleAuthProvider, signInWithPopup, UserCredential } from '@angular/fire/auth';
import { CarRented } from '../models/car-rented.model';
import { CartItemDto } from '../models/cart-item.model';
import { rentCarRequest } from '../models/rent-car.model copy';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenExpirationTimer: any;
  private readonly TOKEN_EXPIRATION_TIME = 10 * 60 * 1000; // 30 seconds

  constructor(private apiService: ApiService, private router: Router, private auth: Auth) {
    this.initializeTokenCheck();
    this.setupActivityListeners();
  }

  private initializeTokenCheck() {
    // Check if there's an existing token when service starts
    if (this.isLoggedIn()) {
      this.setTokenExpirationTimer();
    }
  }

  login(email: string, password: string): Observable<any> {
    const payload = { email, password };
    return this.apiService.login(payload).pipe(
      tap((response) => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('tokenTimestamp', Date.now().toString());
          this.setTokenExpirationTimer();
        }
      })
    );
  }

  signup(name: string, email: string, phoneNumber: string, password: string): Observable<any> {
    const payload = { name, email, phoneNumber, password };
    return this.apiService.signup(payload);
  }

  logout(): void {
    console.log('Logging out');
    localStorage.removeItem('token');
    localStorage.removeItem('tokenTimestamp');
    localStorage.removeItem('role');
    this.clearTokenExpirationTimer();
    this.router.navigate(['/home']);
  }

  getProfile(): Observable<any> {
    return this.apiService.getProfile();
  }  
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const payload = { oldPassword, newPassword };
    return this.apiService.changePassword(payload);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    const tokenTimestamp = parseInt(localStorage.getItem('tokenTimestamp') || '0');
    const now = Date.now();
    
    if (token && tokenTimestamp && (now - tokenTimestamp < this.TOKEN_EXPIRATION_TIME)) {
      return true;
    }
    
    if (token) {
      this.logout(); // Clear expired token
    }
    return false;
  }

  getUserRole(): string {
    return localStorage.getItem('role') || '';
  }

  getUserId(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.parseJwt(token);
      const userId = decodedToken ? decodedToken.sub : null; // 'sub' is the standard claim for subject (UserId)
      if (userId) {
        return userId;
      }
    }
    return null;
  }

  private parseJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  }
  getRentalContractsByUserId(pageNumber: number, pageSize: number): Observable<{ data: CarRented[], totalItems: number }> {
    const userId = this.getUserId();
    if (userId) {
      return this.apiService.getRentalContractsByUserId(userId, pageNumber, pageSize).pipe(
        catchError(this.handleError)
      );
    } else {
      throw new Error('User ID is not available');
    }
  }
  cancelRentalContract(contractId: string): Observable<any> {
    return this.apiService.cancelRentalContract(contractId).pipe(
      catchError(this.handleError)
    );
  }
  getCartItems(): Observable<CartItemDto[]> {
    const userId = this.getUserId();
    if (userId) {
      return this.apiService.getCartItems(userId).pipe(
        catchError(this.handleError)
      );
    } else {
      throw new Error('User ID is not available');
    }
  }
  removeFromCart(cartId: string): Observable<any> {
    const userId = this.getUserId();
    if (userId) {
      return this.apiService.removeFromCart(cartId, userId).pipe(
        catchError(this.handleError)
      );
    } else {
      throw new Error('User ID is not available');
    }
  }
  rentCar(carId: string, rentalDate: Date, returnDate: Date): Observable<any> {
    const userId = this.getUserId();
    if (userId) {
      const rentCarRequest: rentCarRequest = {
        userId: userId,
        carId: carId,
        rentalDate: rentalDate,
        returnDate: returnDate
      };
      return this.apiService.rentCar(rentCarRequest).pipe(
        catchError(this.handleError)
      );
    } else {
      throw new Error('User ID is not available');
    }
  }
  handleGetCars(): Observable<any> {
    return this.apiService.getCars();  
  }
  
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  private setTokenExpirationTimer(): void {
    this.clearTokenExpirationTimer();
    this.tokenExpirationTimer = setTimeout(() => {
      console.log('Token expired');
      this.logout();
      alert('Your session has expired. Please login again.');
    }, this.TOKEN_EXPIRATION_TIME);    
  }

  private clearTokenExpirationTimer(): void {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  private setupActivityListeners(): void {
    ['click', 'mousemove', 'keydown'].forEach(event => {
      window.addEventListener(event, () => {
        if (this.isLoggedIn()) {
          const tokenTimestamp = parseInt(localStorage.getItem('tokenTimestamp') || '0');
          const now = Date.now();
          const timePassed = now - tokenTimestamp;

          if (timePassed < this.TOKEN_EXPIRATION_TIME) {
            // console.log('Activity detected, resetting timer');
            localStorage.setItem('tokenTimestamp', now.toString());
            this.setTokenExpirationTimer();
          }
        }
      });
    });
  }

  updateProfile(name: string, phoneNumber: string): Observable<any> {
    return this.apiService.updateProfile({ name, phoneNumber });
  }

  uploadAvatar(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.apiService.uploadAvatar(formData);
  }

  getAvatarUrl(): Observable<Blob> {
    return this.apiService.getAvatarUrl();
  }
  addCar(carData: any): Observable<any> {
    return this.apiService.addCar(carData).pipe(
      catchError(this.handleError)
    );
  }
  forgotPassword(email: string): Observable<any> {
    return this.apiService.forgotPassword({ email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.apiService.resetPassword({ token, newPassword });
  }

  verifyEmail(token: string, email: string): Observable<any> {
    return this.apiService.verifyEmail({ token, email });
  }
 
}

