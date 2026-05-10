import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { CustomersApi } from '../customers.api';
import { CustomersActions } from './customers.actions';

@Injectable()
export class CustomersEffects {
  private readonly actions$ = inject(Actions);
  private readonly customersApi = inject(CustomersApi);

  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomersActions.loadCustomers),
      switchMap(() =>
        this.customersApi.getAll().pipe(
          map((customers) => CustomersActions.loadCustomersSuccess({ customers })),
          catchError((error: { message?: string }) =>
            of(
              CustomersActions.loadCustomersFailure({
                error: error.message ?? 'Unable to load customers'
              })
            )
          )
        )
      )
    )
  );

  createCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomersActions.createCustomer),
      switchMap(({ payload }) =>
        this.customersApi.create(payload).pipe(
          map((customer) => CustomersActions.createCustomerSuccess({ customer })),
          catchError((error: { message?: string }) =>
            of(
              CustomersActions.createCustomerFailure({
                error: error.message ?? 'Unable to create customer'
              })
            )
          )
        )
      )
    )
  );

  updateCustomerContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomersActions.updateCustomerContact),
      switchMap(({ payload }) =>
        this.customersApi.updateContact(payload).pipe(
          map((customer) =>
            CustomersActions.updateCustomerContactSuccess({ customer })
          ),
          catchError((error: { message?: string }) =>
            of(
              CustomersActions.updateCustomerContactFailure({
                error: error.message ?? 'Unable to update customer contact'
              })
            )
          )
        )
      )
    )
  );

  deleteCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CustomersActions.deleteCustomer),
      switchMap(({ id }) =>
        this.customersApi.delete(id).pipe(
          map(() => CustomersActions.deleteCustomerSuccess({ id })),
          catchError((error: { message?: string }) =>
            of(
              CustomersActions.deleteCustomerFailure({
                error: error.message ?? 'Unable to delete customer'
              })
            )
          )
        )
      )
    )
  );
}
