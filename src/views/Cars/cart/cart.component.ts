import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { CartItemDto } from '../../../models/cart-item.model';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RentalContractDto } from '../../../models/rental-contract.models';
import {  PaymentResponse } from '../../../models/payment.model';
import { VnPayRequestModel } from '../../../models/VnPayRequestModel.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})

export class CartComponent implements OnInit { 

  cartItems: CartItemDto[] = [];
  startDate: string | null = null; 
  @Input() showRentalInfoModal: boolean = false;
  @Input() selectedCar: any;
  @Input() totalAmount: number = 0;
  @Input() rentalContractDto: any;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';
  constructor(private authService: AuthService, private router: Router) {}
  url: string = '';

  ngOnInit(): void {
    this.loadCartItems();
  }

  loadCartItems(): void {
    this.authService.getCartItems().subscribe(
      (items: CartItemDto[]) => {
        console.log('Cart items received from API:', items);
        this.cartItems = items.map(item => ({
          ...item,
          startDate: '', 
          endDate: '' 
        }));
      },
      (error) => {
        console.error('Error fetching cart items', error);
      }
    );
  }

  removeItem(cartId: string): void {
    this.authService.removeFromCart(cartId).subscribe(
      (response) => {
        console.log('Đã xóa mục khỏi giỏ hàng:', response);
        this.loadCartItems();  
      },
      (error) => {
        console.error('Lỗi khi xóa mục khỏi giỏ hàng', error);
        this.showNotification('Lỗi khi xóa mục khỏi giỏ hàng', 'error');
      }
    );
  }
  rentCar(item: CartItemDto): void {
    if (!item.startDate || !item.endDate) {
      this.showNotification('Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.', 'error');
      return;
    }
  
    const rentalDate = new Date(item.startDate);
    const returnDate = new Date(item.endDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    if (rentalDate.getTime() < currentDate.getTime()) {
    this.showNotification('Ngày bắt đầu thuê không thể là quá khứ.', 'error');
    return;
  }
  
    if (rentalDate.getTime() >= returnDate.getTime()) {
      this.showNotification('Ngày trả xe phải sau ngày thuê.', 'error');
      return;
    }
  
    this.authService.rentCar(item.carId, rentalDate, returnDate).subscribe({
      next: (response) => {
        console.log(response);
        this.selectedCar = item;
        this.totalAmount = this.calculateTotalAmount(item.price, rentalDate, returnDate);
        this.showRentalInfoModal = true;
        this.rentalContractDto = response.data;
        console.log(this.totalAmount, this.rentalContractDto?.contractId);
        this.showNotification('Thuê xe thành công!', 'success');
      },
      error: (error) => {
        console.error('Lỗi khi thuê xe:', error);
        this.showNotification(error.error?.message || 'Thuê xe thất bại. Vui lòng thử lại.', 'error');
      }
    });
  }

  calculateTotalAmount(price: number, rentalDate: Date, returnDate: Date): number {
    const timeDiff = Math.abs(returnDate.getTime() - rentalDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return price * diffDays;
  }

  closeModal(): void {
    this.showRentalInfoModal = false;
    this.selectedCar = null;
    this.totalAmount = 0;
  }

  confirmRental(): void {  
    if (!this.rentalContractDto?.contractId || !this.totalAmount) {
      this.showNotification('Thiếu ID hợp đồng hoặc số tiền', 'error');
      return;
    }

    const paymentRequest: VnPayRequestModel = {
      contractId: this.rentalContractDto.contractId,
      amount: this.totalAmount,    
    };

    this.authService.createPayment(
      paymentRequest.contractId,
      paymentRequest.amount,      
    ).subscribe({
      next: (response: PaymentResponse) => {
        console.log(paymentRequest.contractId);
        if (response?.url) {
          localStorage.setItem('pendingPayment', JSON.stringify({
            contractId: this.rentalContractDto.contractId,
            amount: this.totalAmount
          }));
          window.location.href = response.url;
        } else {
          this.showNotification('URL thanh toán không hợp lệ', 'error');
        }
      },
      error: (error) => {
        console.error('Lỗi thanh toán:', error);
        this.showNotification('Khởi tạo thanh toán thất bại. Vui lòng thử lại.', 'error');
      }
    });
  }
  showNotification(message: string, type: 'success' | 'error'): void {
    this.notificationMessage = message;
    this.notificationType = type;
  }

  closeNotificationModal(): void {
    this.notificationMessage = '';
  }
}