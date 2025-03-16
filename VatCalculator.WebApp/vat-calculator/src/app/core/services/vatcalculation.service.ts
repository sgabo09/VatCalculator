import { Injectable, signal } from '@angular/core';
import {
  IVatCalculationRequest,
  VatCalculationClient,
  VatCalculationRequest,
  VatCalculationResponse,
} from '../../../clients/client.generated';

@Injectable({
  providedIn: 'root',
})
export class VatCalculationService {
  constructor(private readonly client: VatCalculationClient) {}

  readonly vatRates = signal<number[]>([]);
  readonly vatResult = signal<VatCalculationResponse | null>(null);
  readonly error = signal<string | null>(null);

  async calculateVat(request: VatCalculationRequest): Promise<void> {
    try {
      const response = await this.client.calculate(request).toPromise();
      if (response) {
        this.vatResult.set(response);
        this.error.set(null);
      } else {
        this.error.set('Received undefined response from the API');
      }
    } catch (err) {
      this.error.set('Failed to calculate VAT');
    }
  }

  async fetchVatRates(): Promise<void> {
    try {
      const rates = await this.client.rates().toPromise();
      if (rates) {
        this.vatRates.set(rates);
      } else {
        console.error('Received undefined VAT rates');
      }
    } catch (error) {
      console.error('Failed to fetch VAT rates:', error);
    }
  }
}
