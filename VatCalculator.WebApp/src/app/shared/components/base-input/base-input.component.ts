import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  AbstractControl,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-base-input',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './base-input.component.html',
  styleUrls: ['./base-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BaseInputComponent),
      multi: true,
    },
  ],
})
export class BaseInputComponent {
  @Input() label: string = '';
  @Input() type: 'text' | 'number' = 'text';
  @Input() prefix: string = '';
  @Input() isRequired: boolean = false;
  @Input() isReadonly: boolean = false;
  @Input() control!: AbstractControl | null;

  value: any = '';
  onChange = (value: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  get formControl(): FormControl {
    return this.control as FormControl;
  }

  hasError(errorName: string): boolean {
    return (
      !!this.control?.hasError(errorName) &&
      (this.control?.touched || this.control?.dirty)
    );
  }
}
