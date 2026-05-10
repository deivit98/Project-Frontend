import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { Customer } from '../models/customer.model';
import { CustomersActions } from './customers.actions';

export interface CustomersState extends EntityState<Customer> {
  loading: boolean;
  error: string | null;
}

const customersAdapter = createEntityAdapter<Customer>({
  selectId: (customer) => customer.id
});

const initialState: CustomersState = customersAdapter.getInitialState({
  loading: false,
  error: null
});

export const customersFeature = createFeature({
  name: 'customers',
  reducer: createReducer(
    initialState,
    on(
      CustomersActions.loadCustomers,
      CustomersActions.createCustomer,
      CustomersActions.updateCustomerContact,
      CustomersActions.deleteCustomer,
      (state) => ({ ...state, loading: true, error: null })
    ),
    on(CustomersActions.loadCustomersSuccess, (state, { customers }) =>
      customersAdapter.setAll(customers, { ...state, loading: false })
    ),
    on(CustomersActions.createCustomerSuccess, (state, { customer }) =>
      customersAdapter.addOne(customer, { ...state, loading: false })
    ),
    on(CustomersActions.updateCustomerContactSuccess, (state, { customer }) =>
      customersAdapter.updateOne(
        { id: customer.id, changes: customer },
        { ...state, loading: false }
      )
    ),
    on(CustomersActions.deleteCustomerSuccess, (state, { id }) =>
      customersAdapter.removeOne(id, { ...state, loading: false })
    ),
    on(
      CustomersActions.loadCustomersFailure,
      CustomersActions.createCustomerFailure,
      CustomersActions.updateCustomerContactFailure,
      CustomersActions.deleteCustomerFailure,
      (state, { error }) => ({ ...state, loading: false, error })
    ),
    on(CustomersActions.clearError, (state) => ({ ...state, error: null }))
  ),
  extraSelectors: ({ selectCustomersState }) => {
    const selectors = customersAdapter.getSelectors(selectCustomersState);
    return {
      selectCustomerEntities: selectors.selectEntities,
      selectCustomerIds: selectors.selectIds,
      selectAllCustomers: selectors.selectAll,
      selectTotalCustomers: selectors.selectTotal,
      selectLoading: (state: object) => selectCustomersState(state).loading,
      selectError: (state: object) => selectCustomersState(state).error
    };
  }
});
