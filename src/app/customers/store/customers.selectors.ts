import { createSelector } from '@ngrx/store';
import { customersFeature } from './customers.reducer';

export const selectCustomers = customersFeature.selectAllCustomers;
export const selectCustomersLoading = customersFeature.selectLoading;
export const selectCustomersError = customersFeature.selectError;

export const selectCustomersSorted = createSelector(selectCustomers, (customers) =>
  [...customers].sort((a, b) => a.surname.localeCompare(b.surname))
);
