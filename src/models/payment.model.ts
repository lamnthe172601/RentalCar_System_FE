// src/models/payment.model.ts
export interface PaymentResponse {
  url: string;
}

export interface PaymentReturnResponse {
  status: string;
  message: string;
  contractId: string;
  amount: string;
  paymentDate?: string;
}