import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-edit-car',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './edit-car.component.html',
  styleUrls: ['./edit-car.component.scss']
})
export class EditCarComponent implements OnInit {
  carForm: FormGroup;
  selectedFile: File | null = null;
  imageUrl: string | null = null;
  carId: string | null = null;
  oldLicensePlate: string | null = null; // Lưu LicensePlate cũ

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.carForm = this.fb.group({
      name: ['', Validators.required],
      licensePlate: ['', Validators.required],
      brand: ['', Validators.required],
      model: ['', Validators.required],
      color: ['', Validators.required],
      seats: ['', Validators.required],
      year: ['', Validators.required],
      madeIn: ['', Validators.required],
      mileage: [0, Validators.required],
      status: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      image: [null] // Add image field
    });

    // Fetch car data by ID
    this.carId = this.route.snapshot.paramMap.get('carId');
    if (this.carId) {
      this.authService.getCarById(this.carId).subscribe(
        (data: any) => {
          this.carForm.patchValue(data); // Populate form with data
          this.imageUrl = data.imageUrl; // Store image URL
          this.oldLicensePlate = data.licensePlate;
          console.log('Car data loaded:', this.carForm.value);
        },
        (error: any) => {
          console.error('Error fetching car:', error);
        }
      );
    }
  }

  ngOnInit(): void {}

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file; // Store the selected file
      this.carForm.patchValue({
        image: file
      });

      // Create a URL for the selected image to display it
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSave(): void {
    if (this.carForm.invalid) {
      // Mark all fields as touched to show validation errors
      this.carForm.markAllAsTouched();
      return;
    }
    if (!this.selectedFile) {
      alert('Vui lòng chọn ảnh mới.');
      return;
    }
    const formData = new FormData();
    formData.append('id', this.carId!); // Add car ID to form data
    formData.append('Name', this.carForm.get('name')?.value);
    formData.append('LicensePlate', this.carForm.get('licensePlate')?.value);
    formData.append('Brand', this.carForm.get('brand')?.value);
    formData.append('Model', this.carForm.get('model')?.value);
    formData.append('Color', this.carForm.get('color')?.value);
    formData.append('Seats', this.carForm.get('seats')?.value);
    formData.append('Year', this.carForm.get('year')?.value);
    formData.append('MadeIn', this.carForm.get('madeIn')?.value);
    formData.append('Mileage', this.carForm.get('mileage')?.value);
    formData.append('Status', this.carForm.get('status')?.value);
    formData.append('Price', this.carForm.get('price')?.value);
    formData.append('Description', this.carForm.get('description')?.value);
    if (this.selectedFile) {
      formData.append('Image', this.selectedFile);
    }

    // Submit form data
    this.authService.updateCar(formData).subscribe(
      response => {
        this.router.navigate(['admin-car']);
      },
      error => {
        console.error('Error updating car:', error);
      }
    );
  }
}