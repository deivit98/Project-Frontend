import { expect, test } from '@playwright/test';

test('customers page renders required fields', async ({ page }) => {
  await page.goto('/');

  const addCustomerButton = page.getByRole('button', { name: 'Add customer' });
  await expect(addCustomerButton).toBeVisible();
  await addCustomerButton.click();

  await expect(page.getByText('Create customer')).toBeVisible();
  await expect(page.getByLabel('First name')).toBeVisible();
  await expect(page.getByLabel('Surname')).toBeVisible();
  await expect(page.getByLabel('D.O.B')).toBeVisible();
  await expect(page.getByLabel('Address')).toBeVisible();
  await expect(page.getByLabel('Phone number')).toBeVisible();
  await expect(page.getByLabel('IBAN')).toBeVisible();
});

test('new customer is visible and shows updated properties after edit', async ({ page }) => {
  type TestCustomer = {
    id: string;
    firstName: string;
    surname: string;
    dateOfBirth: string;
    address: string;
    phoneNumber: string;
    iban: string;
  };

  const customers: TestCustomer[] = [];

  await page.route('**/customers', async (route, request) => {
    if (request.method() === 'GET') {
      await route.fulfill({ json: customers });
      return;
    }

    if (request.method() === 'POST') {
      const payload = request.postDataJSON() as Omit<TestCustomer, 'id'>;
      const createdCustomer: TestCustomer = {
        id: crypto.randomUUID(),
        ...payload
      };
      customers.push(createdCustomer);
      await route.fulfill({ json: createdCustomer });
      return;
    }

    await route.continue();
  });

  await page.route('**/customers/*/contact', async (route, request) => {
    if (request.method() !== 'PUT') {
      await route.continue();
      return;
    }

    const payload = request.postDataJSON() as {
      address: string;
      phoneNumber: string;
      iban: string;
    };
    const customerId = request.url().split('/').at(-2);
    const customer = customers.find((item) => item.id === customerId);

    if (!customer) {
      await route.fulfill({ status: 404, json: { message: 'Customer not found' } });
      return;
    }

    customer.address = payload.address;
    customer.phoneNumber = payload.phoneNumber;
    customer.iban = payload.iban;

    await route.fulfill({ json: customer });
  });

  await page.goto('/');

  const firstName = 'E2EName';
  const surname = 'E2ESurname';
  const dateOfBirth = '1991-03-15';
  const address = '123 Test Street';
  const phoneNumber = '+12345678901';
  const iban = 'DE89370400440532013000';

  await page.getByRole('button', { name: 'Add customer' }).click();

  await page.getByLabel('First name').fill(firstName);
  await page.getByLabel('Surname').fill(surname);
  await page.getByLabel('D.O.B').fill(dateOfBirth);
  await page.getByLabel('Address').fill(address);
  await page.getByLabel('Phone number').fill(phoneNumber);
  await page.getByLabel('IBAN').fill(iban);
  await page.getByRole('button', { name: 'Save' }).click();

  const createdCustomerRow = page.getByRole('row', {
    name: new RegExp(`${firstName}\\s+${surname}`)
  });
  await expect(createdCustomerRow).toBeVisible();
  await expect(createdCustomerRow).toContainText(address);
  await expect(createdCustomerRow).toContainText(phoneNumber);
  await expect(createdCustomerRow).toContainText(iban);

  const updatedAddress = '456 Updated Avenue';
  const updatedPhone = '+19876543210';
  const updatedIban = 'FR1420041010050500013M02606';

  await createdCustomerRow.getByRole('button', { name: 'Edit contact' }).click();
  await expect(page.getByText('Update contact')).toBeVisible();

  await page.getByLabel('Address').fill(updatedAddress);
  await page.getByLabel('Phone number').fill(updatedPhone);
  await page.getByLabel('IBAN').fill(updatedIban);
  await page.getByRole('button', { name: 'Update' }).click();

  await expect(createdCustomerRow).toContainText(updatedAddress);
  await expect(createdCustomerRow).toContainText(updatedPhone);
  await expect(createdCustomerRow).toContainText(updatedIban);
});
