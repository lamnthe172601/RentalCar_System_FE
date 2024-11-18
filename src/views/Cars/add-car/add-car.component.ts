import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-add-car',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './add-car.component.html',
  styleUrls: ['./add-car.component.scss']
})
export class AddCarComponent {
  addCarForm: FormGroup;
  selectedFile: File | null = null;
  brands: string[] = []; // Danh sách hãng xe
  models: { [key: string]: string[] } = {}; // Danh sách model theo hãng
  filteredModels: string[] = []; // Model được lọc theo hãng
  colors: string[] = []; // Danh sách màu sắc
  

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.addCarForm = this.fb.group({
      name: ['', Validators.required],
      licensePlate: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      color: ['', Validators.required],
      seats: [0, Validators.required],
      year: [2024, Validators.required],
      madeIn: ['', Validators.required],
      mileage: [0, Validators.required],
      status: ['', Validators.required],
      price: [0, Validators.required],
      description: ['', Validators.required]
    });
  }
 // Xử lý khi upload file Excel
 onFileChange(event: Event, type: string): void {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      if (type === 'brandModel') {
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        this.processBrandModelData(jsonData);
      } else if (type === 'color') {
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        this.processColorData(jsonData);
      }
    };

    reader.readAsArrayBuffer(file);
  }
}

// Xử lý dữ liệu Brand & Model
processBrandModelData(data: any[]): void {
  this.brands = [];
  this.models = {};

  data.forEach((row: any) => {
    const brand = row.Brand;
    const model = row.Model;

    if (brand && model) {
      if (!this.brands.includes(brand)) {
        this.brands.push(brand);
        this.models[brand] = [];
      }
      this.models[brand].push(model);
    }
  });

  // Thiết lập danh sách model mặc định
  this.filteredModels = this.models[this.brands[0]] || [];
  this.addCarForm.patchValue({ brand: this.brands[0], model: '' });
}

// Xử lý dữ liệu Color
processColorData(data: any[]): void {
  this.colors = data.map((row: any) => row.Color).filter((color) => !!color);
}

// Xử lý thay đổi hãng xe
onBrandChange(event: Event): void {
  const selectedBrand = (event.target as HTMLSelectElement).value;
  this.filteredModels = this.models[selectedBrand] || [];
  this.addCarForm.patchValue({ model: '' }); // Reset model khi hãng thay đổi
}
  // Lấy file khi người dùng upload
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  // Gửi form data đến AuthService
  onSubmit(): void {
    if (this.addCarForm.invalid || !this.selectedFile) {
      alert('Vui lòng điền đầy đủ thông tin và chọn ảnh.');
      return;
    }

    const formData = new FormData();
    formData.append('Name', this.addCarForm.get('name')?.value);
    formData.append('LicensePlate', this.addCarForm.get('licensePlate')?.value);
    formData.append('Brand', this.addCarForm.get('brand')?.value);
    formData.append('Model', this.addCarForm.get('model')?.value);
    formData.append('Color', this.addCarForm.get('color')?.value);
    formData.append('Seats', this.addCarForm.get('seats')?.value);
    formData.append('Year', this.addCarForm.get('year')?.value);
    formData.append('MadeIn', this.addCarForm.get('madeIn')?.value);
    formData.append('Mileage', this.addCarForm.get('mileage')?.value);
    formData.append('Status', this.addCarForm.get('status')?.value);
    formData.append('Price', this.addCarForm.get('price')?.value);
    formData.append('Description', this.addCarForm.get('description')?.value);
    formData.append('Image', this.selectedFile);

    this.authService.addCar(formData).subscribe(
      (response) => {
        alert('Thêm xe thành công!');
        this.addCarForm.reset();
        this.selectedFile = null;
      },
      (error) => {
        console.error('Lỗi khi thêm xe:', error);
        alert('Đã xảy ra lỗi, vui lòng thử lại.');
      }
    );
  }
}
