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
