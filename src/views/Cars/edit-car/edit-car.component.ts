import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators ,ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-edit-car',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './edit-car.component.html',
  styleUrls: ['./edit-car.component.scss']
})
export class EditCarComponent implements OnInit {
  carForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize form with validation
    this.carForm = this.fb.group({
  name: ['', Validators.required],
  licensePlate: ['', Validators.required],
  brand: ['', Validators.required],
  price: ['', Validators.required],
  color: ['', Validators.required],
  seats: ['', Validators.required],
  year: ['', Validators.required],
  madeIn: ['', Validators.required],
  mileage: ['', Validators.required],
  model: ['', Validators.required],
  status: ['', Validators.required],
  description: ['', Validators.required],
});

    // Fetch car data by ID
    const carId = this.route.snapshot.paramMap.get('carId');
    if (carId) {
      this.authService.getCarById(carId).subscribe(
        (data: any) => {
          this.carForm.patchValue(data); // Populate form with data
          console.log('Car data loaded:', this.carForm.value);
        },
        (error: any) => {
          console.error('Error fetching car:', error);
        }
      );
    }
  }

  onSave(): void {
    if (this.carForm.invalid) {
      alert('Please fill in all required fields.');
      return;
    }
  
    const carId = this.carForm.value;
  
    this.authService.updateCar(carId).subscribe({
      next: () => {
        alert('Car updated successfully!');
        
      },
      error: (err) => {
        console.error('Error updating car:', err);
        alert('Failed to update car. Please try again!');
      }
    });
  }
}