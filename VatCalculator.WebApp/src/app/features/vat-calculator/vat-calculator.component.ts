import { Component, computed, effect, OnInit, Signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { BaseInputComponent } from '../../shared/components/base-input/base-input.component';
import { BaseSelectComponent } from '../../shared/components/base-select/base-select.component';
import { VatCalculationService } from '../../core/services/vatcalculation.service';
import { VatCalculationRequest } from '../../../clients/client.generated';
import { SelectOption } from '../../shared/models/select-option.model';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-vat-calculator',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    BaseInputComponent,
    BaseSelectComponent,
  ],
  templateUrl: './vat-calculator.component.html',
  styleUrls: ['./vat-calculator.component.scss'],
})
export class VatCalculatorComponent implements OnInit {
  public vatForm!: FormGroup;
  public isCalculated: boolean = false;
  public isLoading: Signal<boolean>;

  public readonly amountTypes: SelectOption[] = [
    { value: 'net', label: 'Net' },
    { value: 'gross', label: 'Gross' },
    { value: 'vat', label: 'VAT' },
  ];

  public readonly vatRateOptions = computed(() =>
    this.vatCalculationService.vatRates().map((rate) => ({
      value: rate.toString(),
      label: `${rate}%`,
    }))
  );

  constructor(
    private formBuilder: FormBuilder,
    private vatCalculationService: VatCalculationService
  ) {
    this.isLoading = this.vatCalculationService.isLoading;

    effect(() => {
      const result = this.vatCalculationService.vatResult();
      if (result) {
        this.vatForm.patchValue({
          netAmount: result.netAmount,
          grossAmount: result.grossAmount,
          vatAmount: result.vatAmount,
        });
      }
    });
  }

  async ngOnInit(): Promise<void> {
    // Initialize the form group
    this.vatForm = this.formBuilder.group({
      amountType: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]],
      vatRate: [null, Validators.required],
      netAmount: [null],
      grossAmount: [null],
      vatAmount: [null],
    });

    await this.vatCalculationService.fetchVatRates();
  }

  public async onCalculateClick(): Promise<void> {
    if (this.vatForm.invalid) {
      this.validate();
      return;
    }

    const formValue = this.vatForm.value;
    const vatCalculationRequest = this.createVatCalculationRequest(formValue);

    this.isCalculated = true;
    await this.vatCalculationService.calculateVat(vatCalculationRequest);
  }

  public onSelectionChange(): void {
    this.isCalculated = false;
  }

  private createVatCalculationRequest(formValue: any): VatCalculationRequest {
    const request = new VatCalculationRequest({
      vatRate: formValue.vatRate,
    });

    switch (formValue.amountType) {
      case 'vat':
        request.vatAmount = formValue.amount;
        break;
      case 'net':
        request.netAmount = formValue.amount;
        break;
      case 'gross':
        request.grossAmount = formValue.amount;
        break;
    }

    return request;
  }

  // Helper method to mark all form fields as touched
  private validate(): void {
    Object.values(this.vatForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}
