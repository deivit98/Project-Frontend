import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CustomersActions } from './store/customers.actions';
import {
  selectCustomersError,
  selectCustomersLoading,
  selectCustomersSorted
} from './store/customers.selectors';

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    ProgressSpinnerModule,
    TagModule
  ],
  templateUrl: './customers.page.html',
  styleUrl: './customers.page.scss'
})
export class CustomersPageComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  readonly customers$ = this.store.select(selectCustomersSorted);
  readonly loading$ = this.store.select(selectCustomersLoading);
  readonly error$ = this.store.select(selectCustomersError);

  readonly createDialogVisible = signal(false);
  readonly editDialogVisible = signal(false);
  readonly editedCustomerId = signal<string | null>(null);

  readonly createForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    surname: ['', [Validators.required, Validators.maxLength(100)]],
    dateOfBirth: ['', Validators.required],
    address: ['', [Validators.required, Validators.maxLength(250)]],
    phoneNumber: [
      '',
      [Validators.required, Validators.pattern(/^[\d+\-()\s]{7,30}$/)]
    ],
    iban: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{15,34}$/)]]
  });

  readonly contactForm = this.fb.nonNullable.group({
    address: ['', [Validators.required, Validators.maxLength(250)]],
    phoneNumber: [
      '',
      [Validators.required, Validators.pattern(/^[\d+\-()\s]{7,30}$/)]
    ],
    iban: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{15,34}$/)]]
  });

  ngOnInit(): void {
    this.store.dispatch(CustomersActions.loadCustomers());
    this.error$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.createForm.enable());
  }

  openCreateDialog(): void {
    this.createForm.reset();
    this.createDialogVisible.set(true);
  }

  openEditDialog(customer: {
    id: string;
    address: string;
    phoneNumber: string;
    iban: string;
  }): void {
    this.editedCustomerId.set(customer.id);
    this.contactForm.setValue({
      address: customer.address,
      phoneNumber: customer.phoneNumber,
      iban: customer.iban
    });
    this.editDialogVisible.set(true);
  }

  submitCreate(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    const value = this.createForm.getRawValue();
    this.store.dispatch(
      CustomersActions.createCustomer({
        payload: {
          ...value,
          iban: value.iban.toUpperCase()
        }
      })
    );
    this.createDialogVisible.set(false);
  }

  submitContactUpdate(): void {
    if (this.contactForm.invalid || !this.editedCustomerId()) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const value = this.contactForm.getRawValue();
    this.store.dispatch(
      CustomersActions.updateCustomerContact({
        payload: {
          id: this.editedCustomerId()!,
          ...value,
          iban: value.iban.toUpperCase()
        }
      })
    );
    this.editDialogVisible.set(false);
  }

  deleteCustomer(id: string): void {
    this.store.dispatch(CustomersActions.deleteCustomer({ id }));
  }

  closeDialogs(): void {
    this.createDialogVisible.set(false);
    this.editDialogVisible.set(false);
    this.editedCustomerId.set(null);
  }
}
