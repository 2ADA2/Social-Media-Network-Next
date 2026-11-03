import { expect, test } from '@playwright/test';

test.describe('Profile page', () => {
  test.describe.configure({ mode: 'serial' });

  test.describe('Preferences', () => {
    test('toggles dark theme', async ({ page }) => {
      await page.goto('http://localhost:3000/profile');

      const themeToggle = page.getByRole('button', { name: 'Switch theme' });

      await expect(themeToggle).toHaveAttribute('aria-pressed', 'false');

      await themeToggle.click();
      await expect(themeToggle).toHaveAttribute('aria-pressed', 'true');

      await themeToggle.click();
      await expect(themeToggle).toHaveAttribute('aria-pressed', 'false');
    });

    test('Switch language', async ({ page }) => {
      await page.goto('http://localhost:3000/profile');

      const languageSelect = page.getByRole('combobox', { name: 'Language' });

      const logoutButtonEN = page.getByRole('button', { name: 'Logout' });
      const logoutButtonRU = page.getByRole('button', { name: 'Выйти' });

      await languageSelect.selectOption('ru');
      await expect(languageSelect).toHaveValue('ru');

      await expect(logoutButtonEN).not.toBeVisible();
      await expect(logoutButtonRU).toBeVisible();

      await languageSelect.selectOption('en');

      await expect(logoutButtonEN).toBeVisible();
      await expect(logoutButtonRU).not.toBeVisible();
    });
  });

  test.describe('Edit profile', () => {
    test('Empty name triggers validation error', async ({ page }) => {
      await page.goto('http://localhost:3000/profile');

      const field = page.getByRole('textbox', { name: 'First name' });

      await field.fill('');

      await expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('overflowing name triggers validation error', async ({ page }) => {
      await page.goto('http://localhost:3000/profile');

      const field = page.getByRole('textbox', { name: 'First name' });

      await field.fill('Helena'.repeat(10));

      await expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('empty second name triggers validation error', async ({ page }) => {
      await page.goto('http://localhost:3000/profile');

      const field = page.getByRole('textbox', { name: 'Second name' });

      await field.fill('');

      await expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('overflowing second name triggers validation error', async ({
      page,
    }) => {
      await page.goto('http://localhost:3000/profile');

      const field = page.getByRole('textbox', { name: 'Second name' });

      await field.fill('Hills'.repeat(10));

      await expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('Username starts with @', async ({ page }) => {
      await page.goto('http://localhost:3000/profile');

      const field = page.getByRole('textbox', { name: 'Username' });

      await field.fill('helenahills');

      await expect(field).toHaveAttribute('aria-invalid', 'true');
    });

    test('Cant save changes while invalid', async ({ page }) => {
      await page.goto('http://localhost:3000/profile');

      const saveButton = page.getByRole('button', {
        name: 'Save profile changes',
      });

      await saveButton.click();

      await page.reload();

      const field = page.getByRole('textbox', { name: 'First name' });

      await expect(field).toHaveValue('Helena');
    });

    test('updates profile if valid', async ({ page }) => {
      await page.goto('http://localhost:3000/profile');
      const newName = 'Hanna';
      const newSecondName = 'Malek';
      const newUsername = '@hannamalek';
      const newDescription = 'Playwright playtest';

      const saveButton = page.getByRole('button', {
        name: 'Save profile changes',
      });
      const nameField = page.getByRole('textbox', { name: 'First name' });
      const secondNameField = page.getByRole('textbox', {
        name: 'Second name',
      });
      const usernameField = page.getByRole('textbox', { name: 'Username' });
      const descriptionField = page.getByRole('textbox', {
        name: 'Description',
      });

      await nameField.fill(newName);
      await secondNameField.fill(newSecondName);
      await usernameField.fill(newUsername);
      await descriptionField.fill(newDescription);

      await saveButton.click();

      await page.reload();

      await expect(nameField).toHaveValue(newName);
      await expect(secondNameField).toHaveValue(newSecondName);
      await expect(usernameField).toHaveValue(newUsername);
      await expect(descriptionField).toHaveValue(newDescription);
    });
  });

  test.describe('Update email', () => {
    test('cant update if invalid password and close modal', async ({
      page,
    }) => {
      await page.goto('http://localhost:3000/profile');

      const field = page.getByRole('textbox', { name: 'Email' });
      const saveButton = page.getByRole('button', {
        name: 'Save profile changes',
      });
      await field.fill('hanna.malek@mail.com');

      await saveButton.click();

      const modal = page.getByTestId('modal');
      const confirmField = modal.getByRole('textbox', {
        name: 'Current password',
      });

      await confirmField.fill('password');

      const confirmButton = page.getByRole('button', { name: 'Confirm' });
      await confirmButton.click();

      const closeButton = page.getByRole('button', { name: 'Close modal' });
      await closeButton.click();

      const notification = page.getByTestId('notification');
      await expect(notification).toHaveAttribute('role', 'alert');
      await expect(notification).toHaveText('Wrong password');

      await expect(modal).not.toBeVisible();
    });

    test('Updated email if password is correct', async ({ page }) => {
      const newEmail = 'hanna.malek@mail.com';
      await page.goto('http://localhost:3000/profile');

      const field = page.getByRole('textbox', { name: 'Email' });
      const saveButton = page.getByRole('button', {
        name: 'Save profile changes',
      });
      await field.fill(newEmail);

      await saveButton.click();

      const modal = page.getByTestId('modal');
      const confirmField = modal.getByRole('textbox', {
        name: 'Current password',
      });

      await confirmField.fill('password789');

      const confirmButton = page.getByRole('button', { name: 'Confirm' });
      await confirmButton.click();

      const notification = page.getByTestId('notification');
      await expect(notification).toHaveText('Your email successfully updated');

      await expect(modal).not.toBeVisible();

      await page.reload();

      await expect(field).toHaveValue(newEmail);
    });
  });

  test.describe('Actions', () => {
    test('Logout', async ({ page }) => {
      await page.goto('http://localhost:3000/profile');

      const logoutButton = await page.getByRole('button', { name: 'Logout' });

      await logoutButton.click();

      await page.waitForURL('http://localhost:3000/');
    });
  });
});
