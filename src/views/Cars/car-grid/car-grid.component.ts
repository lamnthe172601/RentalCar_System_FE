import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

interface Car {
  CarId: string;
  Name: string;
  LicensePlate: string;
  Brand: string;
  Model: string;
  Color: string;
  Seats: number;
  Year: number;
  MadeIn: string;
  Mileage: number;
  Status: string;
  Price: number;
  Description: string;
  Images: string[];
}
@Component({
  selector: 'app-car-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './car-grid.component.html',
  styleUrls: ['./car-grid.component.scss']
})
export class CarGridComponent implements OnInit {
  cars: any[] = [];
  sortedCars: any[] = []; // Danh sách xe đã sắp xếp
  currentPage: number = 1; // Trang hiện tại
  itemsPerPage: number = 6; // Số xe trên mỗi trang
  currentSort: string = 'default'; // Tiêu chí sắp xếp hiện tại
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Gọi phương thức handleGetCars() từ AuthService
    this.authService.handleGetCars().subscribe(
      (data: any) => {  // Khai báo kiểu dữ liệu cho 'data'
        this.cars = data;  // Gán dữ liệu xe nhận được vào mảng cars
        console.log('Danh sách xe:', data);
        this.cars.forEach(car => {
          console.log('Car price:', car.price);
        });
      },
      (error: any) => {  // Khai báo kiểu dữ liệu cho 'error'
        console.error('Lỗi khi lấy dữ liệu xe:', error);  // Xử lý lỗi nếu có
      }
    );
  }
  get displayedCars() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.cars.slice(startIndex, startIndex + this.itemsPerPage);
  }
  getCarImagePath(car: any): string {
    if (car.images && car.images.length > 0) {
      return `data:image/jpeg;base64,${car.images[0]}`; // Hiển thị ảnh đầu tiên
    }
    return 'path/to/default/image.jpg'; // Ảnh mặc định
  }
  
  // Tổng số trang
  get totalPages() {
    return Math.ceil(this.cars.length / this.itemsPerPage);
  }
  
  // Chuyển trang
  changePage(page: number) {
    this.currentPage = page;
  }
   // Sắp xếp xe theo tiêu chí
   sortCars(criteria: string) {
    this.currentSort = criteria; // Lưu tiêu chí sắp xếp hiện tại

    switch (criteria) {
      case 'popularity':
        this.sortedCars.sort((a, b) => b.popularity - a.popularity); // Sắp xếp theo độ phổ biến (giả sử có thuộc tính 'popularity')
        break;
      case 'latest':
        this.sortedCars.sort((a, b) => b.year - a.year); // Sắp xếp theo năm sản xuất
        break;
      case 'average-price':
        this.sortedCars.sort((a, b) => a.averagePrice - b.averagePrice); // Sắp xếp theo giá trung bình (giả sử có thuộc tính 'averagePrice')
        break;
      case 'low-to-high':
        this.sortedCars.sort((a, b) => a.price - b.price); // Giá thấp đến cao
        break;
      case 'high-to-low':
        this.sortedCars.sort((a, b) => b.price - a.price); // Giá cao đến thấp
        break;
      default:
        this.sortedCars = [...this.cars]; // Mặc định, giữ nguyên thứ tự ban đầu
    }

    this.currentPage = 1; // Reset về trang đầu tiên sau khi sắp xếp
  }
  addToCart(carId: string): void {
    console.log('Adding car to cart with ID:', carId);
    this.authService.addToCart(carId).subscribe({
      next: (response) => {
        alert(response.message);
      },
      error: (error) => {
        console.log(carId);
        console.error('Error adding to cart:', error);
        alert('Failed to add car to cart. Please try again.');
      }
    });
  }
}

