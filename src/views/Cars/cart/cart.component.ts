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
        console.log('Item removed from cart:', response);
        this.loadCartItems();  
      },
      (error) => {
        console.error('Error removing item from cart', error);
      }
    );
  }
  rentCar(item: CartItemDto): void {
    if (!item.startDate || !item.endDate) {
      alert('Please select both start date and end date.');
      return;
    }
  
    const rentalDate = new Date(item.startDate);
    const returnDate = new Date(item.endDate);
  
    if (rentalDate >= returnDate) {
      alert('The return date must be after the rental date.');
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
      },
      error: (error) => {
        console.error('Error renting car:', error);
        alert(error.error?.message || 'Failed to rent the car. Please try again.');
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
      alert('Missing contract ID or amount');
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
          alert('Invalid payment URL received');
        }
      },
      error: (error) => {
        console.error('Payment error:', error);
        alert('Failed to initiate payment. Please try again.');
      }
    });
  }
  
}