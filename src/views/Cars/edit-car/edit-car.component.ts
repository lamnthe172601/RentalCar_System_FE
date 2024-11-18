import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-edit-car',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-car.component.html',
  styleUrls: ['./edit-car.component.scss']
})
export class EditCarComponent implements OnInit {
  editCarForm: FormGroup;
  selectedFile: File | null = null;
  carId: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    this.editCarForm = this.fb.group({
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
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Lấy `carId` từ URL
    this.carId = this.route.snapshot.paramMap.get('id') || '';

    // Gọi API để lấy thông tin xe
    this.authService.getCarById(this.carId).subscribe((car) => {
      this.editCarForm.patchValue({
        name: car.name,
        licensePlate: car.licensePlate,
        brand: car.brand,
        model: car.model,
        color: car.color,
        seats: car.seats,
        year: car.year,
        madeIn: car.madeIn,
        mileage: car.mileage,
        status: car.status,
        price: car.price,
        description: car.description,
      });
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.editCarForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('Name', this.editCarForm.get('name')?.value);
    formData.append('LicensePlate', this.editCarForm.get('licensePlate')?.value);
    formData.append('Brand', this.editCarForm.get('brand')?.value);
    formData.append('Model', this.editCarForm.get('model')?.value);
    formData.append('Color', this.editCarForm.get('color')?.value);
    formData.append('Seats', this.editCarForm.get('seats')?.value);
    formData.append('Year', this.editCarForm.get('year')?.value);
    formData.append('MadeIn', this.editCarForm.get('madeIn')?.value);
    formData.append('Mileage', this.editCarForm.get('mileage')?.value);
    formData.append('Status', this.editCarForm.get('status')?.value);
    formData.append('Price', this.editCarForm.get('price')?.value);
    formData.append('Description', this.editCarForm.get('description')?.value);

    if (this.selectedFile) {
      formData.append('Image', this.selectedFile);
    }

    // Gọi API cập nhật xe
    this.authService.updateCar(this.carId, formData).subscribe(
      (response) => {
        alert('Car updated successfully!');
      },
      (error) => {
        console.error('Error updating car:', error);
        alert('Failed to update car.');
      }
    );
  }
}
