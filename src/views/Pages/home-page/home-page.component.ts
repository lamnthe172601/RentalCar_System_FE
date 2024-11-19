import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  cars: any[] = [];
  carImageMap: Map<string, string> = new Map(); // Store random images per car
  
  private readonly defaultCarImages = [
    'assets/images/Cars/Cars/Car-1.jpg',
    'assets/images/Cars/Cars/Car-2.jpg',
    'assets/images/Cars/Cars/Car-3.jpg',
    'assets/images/Cars/Cars/Car-4.jpg',
    'assets/images/Cars/Cars/Car-5.jpg',
    'assets/images/Cars/Cars/Car-6.jpg'
  ];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.handleGetCars().subscribe({
      next: (data: any) => {
        this.cars = data.slice(0, 5);
        // Pre-assign random images for cars without images
        this.cars.forEach(car => {
          if (!car.images || car.images.length === 0) {
            const randomIndex = Math.floor(Math.random() * this.defaultCarImages.length);
            this.carImageMap.set(car.carId, this.defaultCarImages[randomIndex]);
          }
        });
      },
      error: (error: any) => {
        console.error('Error fetching cars:', error);
      }
    });
  }

  getCarImageUrl(car: any): string {
    if (car.images && car.images.length > 0) {
      return `data:image/jpeg;base64,${car.images[0]}`;
    }
    // Return cached random image for this car
    return this.carImageMap.get(car.carId) || this.defaultCarImages[0];
  }
}
