import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { Observable } from 'rxjs';
import { CarRented } from '../models/car-rented.model';
import { ForgotPasswordRequest, ResetPasswordRequest, VerifyEmailRequest } from '../models/password.model';
import { CartItemDto } from '../models/cart-item.model';
import { rentCarRequest } from '../models/rent-car.model copy';
import { UserProfile } from 'firebase/auth';
import { UpdateProfileRequest } from '../models/profile.model';
import { RentalContractDto } from '../models/rental-contract.models';
import { VnPayRequestModel } from '../models/VnPayRequestModel.model';
import { PaymentResponse, PaymentReturnResponse } from '../models/payment.model';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private headerCustom: { headers: { [key: string]: string } } = { headers: { "Authorization": "Bearer " + localStorage.getItem("token") || '' } }

  constructor(private http: HttpClient) {
    this.headerCustom = { headers: { "Authorization": "Bearer " + localStorage.getItem("token") } }

  }
  private baseUrl = environment.apiUrl;
  private imageBaseUrl = 'https://localhost:44360'; // Add this line

  // Add method to get full image URL
  getFullImageUrl(relativePath: string): string {
    if (!relativePath) return '';
    return `${this.imageBaseUrl}${relativePath}`;
  }

  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/General/login`, data);
  }

  signup(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/General/register`, data);
  }

  changePassword(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/General/change-password`, data, this.headerCustom);
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/General/Get-profile`, this.headerCustom);
  }

  updateProfile(data: UpdateProfileRequest): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/General/update-profile`, data, this.headerCustom);
  }

  uploadAvatar(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.baseUrl}/General/upload-avatar`, formData, this.headerCustom);
  }

  getAvatar(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/General/get-avatar`, {
      ...this.headerCustom,
      responseType: 'blob'
    });
  }

  getAvatarUrl(): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/General/get-avatar`, {
      ...this.headerCustom,
      responseType: 'blob'
    });
  }

  // Helper method to create object URL from blob
  createImageFromBlob(blob: Blob): string {
    return URL.createObjectURL(blob);
  }
  getRentalContractsByUserId(userId: string, pageNumber: number, pageSize: number): Observable<{ data: CarRented[], totalItems: number }> {
    const url = `${this.baseUrl}/RentalContracts/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<{ data: CarRented[], totalItems: number }>(url, this.headerCustom);
  }
  cancelRentalContract(contractId: string): Observable<any> {
    const url = `${this.baseUrl}/RentalContracts/${contractId}/cancel`;
    return this.http.post<any>(url, {}, this.headerCustom);
  }
  
  getCars(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Car/all-car`);
  }
  addCar(carData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Car/add-car`, carData);
  }
  getCarById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Car/get-car/${id}`);
  }

  updateCar(carId: string, carData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/Car/edit-car/${carId}`, carData);
  }
  deleteCar(carData: any): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/Car/id`, carData);
  }
  searchCar(query: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Car/search-car?query=${query}`, this.headerCustom);
  }
  forgotPassword(data: ForgotPasswordRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/General/forgot-password`, data);
  }

  resetPassword(data: ResetPasswordRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/General/reset-password`, data);
  }

  verifyEmail(data: VerifyEmailRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/General/verify-email`, data);
  }

  getCartItems(userId: string): Observable<CartItemDto[]> {
    const url = `${this.baseUrl}/Cart/${userId}`;
    return this.http.get<CartItemDto[]>(url, this.headerCustom);
  }
  removeFromCart(cartId: string, userId: string): Observable<any> {
    const url = `${this.baseUrl}/Cart/remove/${cartId}/${userId}`;
    return this.http.delete<any>(url, this.headerCustom);
  }
  addToCart(userId: string, carId: string): Observable<{ message: string }> {
    const url = `${this.baseUrl}/cart/add`;
    return this.http.post<{ message: string }>(url, { userId, carId });
  }
  rentCar(request: any): Observable<{ message: string; data: RentalContractDto }> {
    return this.http.post<{ message: string; data: RentalContractDto }>(`${this.baseUrl}/RentalContracts/rent`, request);
  }
  createPayment(request: VnPayRequestModel): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(`${this.baseUrl}/Payment/create-payment`, request);
  }

  verifyPayment(params: any): Observable<PaymentReturnResponse> {
    return this.http.get<PaymentReturnResponse>(`${this.baseUrl}/Payment/return`, { params });
  }
}
