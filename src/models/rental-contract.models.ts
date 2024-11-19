export interface RentalContractDto { 
  contractId: string;
  carId: string;
  userId: string;
  rentalDate: Date;
  returnDate: Date;
  price: number;
  status: string;  
  }