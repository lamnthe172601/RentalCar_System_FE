import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CartItemDto } from '../../../models/cart-item.model';
import { AuthService } from '../../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit { 

  cartItems: CartItemDto[] = [];
  startDate: string | null = null; 
  endDate: string | null = null;
  constructor(private authService: AuthService) {}

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
    if (item.startDate && item.endDate) {
      const rentalDate = new Date(item.startDate);
      const returnDate = new Date(item.endDate);

      this.authService.rentCar(item.carId, rentalDate, returnDate).subscribe(
        (response) => {
          console.log(`Car rented successfully for carId: ${item.carId}`, response);
          alert('Car rented successfully!');
          item.startDate = ''; 
          item.endDate = ''; 
        },
        (error) => {
          console.error('Error renting car:', error);
          alert('Failed to rent the car. Please try again.');
        }
      );
    } else {
      alert('Please select both start date and end date.');
    }
  }
  
  
}
