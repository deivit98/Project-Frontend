export interface Customer {
  id: string;
  firstName: string;
  surname: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  iban: string;
}

export interface CreateCustomerPayload {
  firstName: string;
  surname: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  iban: string;
}

export interface UpdateCustomerContactPayload {
  id: string;
  address: string;
  phoneNumber: string;
  iban: string;
}
