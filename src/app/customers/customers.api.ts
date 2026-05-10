import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';
import {
  CreateCustomerPayload,
  Customer,
  UpdateCustomerContactPayload
} from './models/customer.model';

@Injectable({ providedIn: 'root' })
export class CustomersApi {
  private readonly http = inject(HttpClient);
  private readonly endpoint = `${API_BASE_URL}/customers`;

  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.endpoint);
  }

  create(payload: CreateCustomerPayload): Observable<Customer> {
    return this.http.post<Customer>(this.endpoint, payload);
  }

  updateContact(payload: UpdateCustomerContactPayload): Observable<Customer> {
    const { id, address, phoneNumber, iban } = payload;
    return this.http.put<Customer>(`${this.endpoint}/${id}/contact`, {
      address,
      phoneNumber,
      iban
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
