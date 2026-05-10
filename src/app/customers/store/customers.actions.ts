import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateCustomerPayload,
  Customer,
  UpdateCustomerContactPayload
} from '../models/customer.model';

export const CustomersActions = createActionGroup({
  source: 'Customers',
  events: {
    'Load Customers': emptyProps(),
    'Load Customers Success': props<{ customers: Customer[] }>(),
    'Load Customers Failure': props<{ error: string }>(),
    'Create Customer': props<{ payload: CreateCustomerPayload }>(),
    'Create Customer Success': props<{ customer: Customer }>(),
    'Create Customer Failure': props<{ error: string }>(),
    'Update Customer Contact': props<{ payload: UpdateCustomerContactPayload }>(),
    'Update Customer Contact Success': props<{ customer: Customer }>(),
    'Update Customer Contact Failure': props<{ error: string }>(),
    'Delete Customer': props<{ id: string }>(),
    'Delete Customer Success': props<{ id: string }>(),
    'Delete Customer Failure': props<{ error: string }>(),
    'Clear Error': emptyProps()
  }
});
