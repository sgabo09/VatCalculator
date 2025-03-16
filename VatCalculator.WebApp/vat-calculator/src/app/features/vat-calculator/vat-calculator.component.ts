import { Component, computed, effect, OnInit } from '@angular/core';
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
    ReactiveFormsModule,
    BaseInputComponent,
    BaseSelectComponent,
  ],
  templateUrl: './vat-calculator.component.html',
  styleUrls: ['./vat-calculator.component.scss'],
})
export class VatCalculatorComponent implements OnInit {
  vatForm!: FormGroup;
  amountTypes = [
    { value: 'net', label: 'Net' },
    { value: 'gross', label: 'Gross' },
    { value: 'vat', label: 'VAT' },
  ];
  isCalculated: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private vatCalculationService: VatCalculationService
  ) {
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

  readonly vatRateOptions = computed(() =>
    this.vatCalculationService.vatRates().map((rate) => ({
      value: rate.toString(),
      label: `${rate}%`,
    }))
  );

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

    this.vatCalculationService.fetchVatRates();
  }

  async onCalculateClick(): Promise<void> {
    if (this.vatForm.invalid) {
      this.validate();
      return;
    }

    const formValue = this.vatForm.value;

    const vatCalculationRequest = new VatCalculationRequest({
      vatRate: formValue.vatRate,
    });

    switch (formValue.amountType) {
      case 'vat':
        vatCalculationRequest.vatAmount = formValue.amount;
        break;
      case 'net':
        vatCalculationRequest.netAmount = formValue.amount;
        break;
      case 'gross':
        vatCalculationRequest.grossAmount = formValue.amount;
        break;
    }

    this.isCalculated = true;

    this.vatCalculationService.calculateVat(vatCalculationRequest);
  }

  onSelectionChange(): void {
    this.isCalculated = false;
  }

  // Helper method to mark all form fields as touched
  private validate(): void {
    Object.values(this.vatForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}
