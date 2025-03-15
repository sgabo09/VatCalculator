import { Component, OnInit } from '@angular/core';
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
  vatForm!: FormGroup; // Form group for the VAT calculator
  vatRateOptions = [
    { value: '10', label: '10%' },
    { value: '13', label: '13%' },
    { value: '20', label: '20%' },
  ];

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    // Initialize the form group
    this.vatForm = this.formBuilder.group({
      netAmount: [null, [Validators.required, Validators.min(0)]],
      grossAmount: [null, [Validators.required, Validators.min(0)]],
      vatRate: [null, Validators.required],
    });
  }

  onCalculateClick(): void {
    if (this.vatForm.invalid) {
      this.validate();
      console.log('Form is invalid', this.vatForm);
      return;
    }

    const formValue = this.vatForm.value;
    console.log('Form values:', formValue);

    // Add your calculation logic here
  }

  // Helper method to mark all form fields as touched
  private validate(): void {
    Object.values(this.vatForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }
}
