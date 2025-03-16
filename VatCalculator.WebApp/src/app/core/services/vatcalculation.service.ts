import { Injectable, signal } from '@angular/core';
import {
  VatCalculationClient,
  VatCalculationRequest,
  VatCalculationResponse,
} from '../../../clients/client.generated';

@Injectable({
  providedIn: 'root',
})
export class VatCalculationService {
  public readonly vatRates = signal<number[]>([]);
  public readonly vatResult = signal<VatCalculationResponse | null>(null);
  public readonly error = signal<string | null>(null);
  public readonly isLoading = signal<boolean>(false);

  constructor(private readonly client: VatCalculationClient) {}

  public async calculateVat(request: VatCalculationRequest): Promise<void> {
    try {
      this.isLoading.set(true);
      const response = await this.client.calculate(request).toPromise();
      if (response) {
        this.vatResult.set(response);
        this.error.set(null);
      } else {
        this.error.set('Received undefined response from the API');
      }
    } catch (err) {
      this.error.set('Failed to calculate VAT');
    } finally {
      this.isLoading.set(false);
    }
  }

  public async fetchVatRates(): Promise<void> {
    try {
      this.isLoading.set(true);
      const rates = await this.client.rates().toPromise();
      if (rates) {
        this.vatRates.set(rates);
      } else {
        this.error.set('Received undefined VAT rates');
      }
    } catch (error) {
      this.error.set(`Failed to fetch VAT rates:' ${error}`);
    } finally {
      this.isLoading.set(false);
    }
  }
}
