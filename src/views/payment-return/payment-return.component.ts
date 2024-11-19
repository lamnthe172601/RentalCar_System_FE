import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../api/api.service';
import { PaymentReturnResponse } from '../../models/payment.model';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-return',
  standalone: true,
  imports: [RouterOutlet, RouterLinkActive, RouterLink,CommonModule, RouterModule],
  templateUrl: './payment-return.component.html',
  styleUrls: ['./payment-return.component.scss']
})
export class PaymentReturnComponent implements OnInit {
  loading = true;
  success = false;
  message = '';
  contractId = '';
  amount = '';
  paymentDate = '';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.apiService.verifyPayment(params).subscribe({
        next: (response: PaymentReturnResponse) => {
          this.loading = false;
          this.success = response.status === 'Success';
          this.message = response.message;
          this.contractId = response.contractId;
          this.amount = response.amount;
          this.paymentDate = response.paymentDate || '';
          console.log('Payment verification response:', response);
          
          if (this.success) {
            // Clear pending payment data
            localStorage.removeItem('pendingPayment');
          }

          // Trigger change detection
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.loading = false;
          this.success = false;
          this.message = 'Payment verification failed';
          console.error('Payment verification error:', error);

          // Trigger change detection
          this.cdr.detectChanges();
        }
      });
    });
  }

  returnToCart() {
    this.router.navigate(['/cart']);
  }
}
