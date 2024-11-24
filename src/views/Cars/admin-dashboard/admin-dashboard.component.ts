import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  totalRevenue: number | null = null; // Tổng doanh thu
  paymentCount: { status: string; count: number } | null = null; // Số lượng thanh toán theo trạng thái
  payments: any[] = []; // Danh sách thanh toán theo khoảng thời gian

  isLoading = true; // Trạng thái tải
  error: string | null = null; // Thông báo lỗi

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // Gọi các API và load dữ liệu
  loadDashboardData(): void {
    this.isLoading = true;

    // Lấy tổng doanh thu
    this.authService.getTotalRevenue().subscribe({
      next: (data) => {
        this.totalRevenue = data?.TotalRevenue || 0;
      },
      error: (err) => {
        this.error = 'Failed to load total revenue.';
        console.error(err);
      },
    });

    // Lấy số lượng thanh toán theo trạng thái
    this.authService.getPaymentCountByStatus('Completed').subscribe({
      next: (data) => {
        this.paymentCount = { status: data?.Status, count: data?.Count };
      },
      error: (err) => {
        this.error = 'Failed to load payment count.';
        console.error(err);
      },
    });

    // Lấy danh sách thanh toán trong khoảng thời gian
    const startDate = '2023-01-01';
    const endDate = '2023-12-31';
    this.authService.getPaymentsByDateRange(startDate, endDate).subscribe({
      next: (data) => {
        this.payments = data || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load payments by date range.';
        console.error(err);
        this.isLoading = false;
      },
    });
  }
}