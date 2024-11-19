import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { data } from 'jquery';
import { Observable } from 'rxjs';
import { CarRented } from '../models/car-rented.model';
import { ForgotPasswordRequest, ResetPasswordRequest, VerifyEmailRequest } from '../models/password.model';
import { UserProfile } from 'firebase/auth';
import { UpdateProfileRequest } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private headerCustom: { headers: { [key: string]: string } } = { headers: { "Authorization": "Bearer " + localStorage.getItem("token") || '' } }

  constructor(private http: HttpClient) {
    this.headerCustom = { headers: { "Authorization": "Bearer " + localStorage.getItem("token") } }

  }
  private baseUrl = 'https://localhost:44360/api';
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
    const url = `https://localhost:44360/api/RentalContracts/user/${userId}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<{ data: CarRented[], totalItems: number }>(url, this.headerCustom);
  }
  cancelRentalContract(contractId: string): Observable<any> {
    const url = `https://localhost:44360/api/RentalContracts/${contractId}/cancel`;
    return this.http.post<any>(url, {}, this.headerCustom);
  }
  
  getCars(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Car/all-car`);
  }
  addCar(carData: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/Car/add-car`, carData);
  }
  getCarById(carId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/Car/${carId}`);
  }

  
  updateCar(car: any): Observable<any> {
    const id = car.get('id');
    return this.http.put<any>(`${this.baseUrl}/Car/edit-car?id=${id}`, car);
  }
  deleteCar(carId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/Car/delete-car/${carId}`);
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
}
