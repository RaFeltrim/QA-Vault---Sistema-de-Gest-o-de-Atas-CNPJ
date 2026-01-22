import { test, expect } from '../fixtures/test-fixtures.js';

test.describe('Authentication Flow with Mocked Backend', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display login screen on initial load', async ({ page }) => {
        await expect(page.getByText('QA Vault Access')).toBeVisible();
        await expect(page.getByTestId('login-user-select-Rafael')).toBeVisible();
        await expect(page.getByTestId('login-user-select-Mauricio')).toBeVisible();
        await expect(page.getByTestId('login-password-input')).toBeVisible();
        await expect(page.getByTestId('login-submit-button')).toBeVisible();
    });

    test('should select user Rafael', async ({ page }) => {
        const rafaelButton = page.getByTestId('login-user-select-Rafael');
        await rafaelButton.click();

        await expect(rafaelButton).toHaveClass(/border-indigo-600/);
    });

    test('should select user Mauricio', async ({ page }) => {
        const mauricioButton = page.getByTestId('login-user-select-Mauricio');
        await mauricioButton.click();

        await expect(mauricioButton).toHaveClass(/border-indigo-600/);
    });

    test('should login successfully with Rafael', async ({ page }) => {
        await page.getByTestId('login-user-select-Rafael').click();
        await page.getByTestId('login-password-input').fill('senha123');
        await page.getByTestId('login-submit-button').click();

        await expect(page.getByTestId('sidebar-logout-btn')).toBeVisible({ timeout: 10000 });
        await expect(page.getByTestId('new-ata-btn')).toBeVisible();
    });

    test('should login successfully with Mauricio', async ({ page }) => {
        await page.getByTestId('login-user-select-Mauricio').click();
        await page.getByTestId('login-password-input').fill('senha123');
        await page.getByTestId('login-submit-button').click();

        await expect(page.getByTestId('sidebar-logout-btn')).toBeVisible({ timeout: 10000 });
    });

    test('should show error with wrong password', async ({ page }) => {
        await page.getByTestId('login-user-select-Rafael').click();
        await page.getByTestId('login-password-input').fill('wrongpassword');
        await page.getByTestId('login-submit-button').click();

        await expect(page.getByText('QA Vault Access')).toBeVisible();
    });

    test('should logout successfully', async ({ page }) => {
        await page.getByTestId('login-user-select-Rafael').click();
        await page.getByTestId('login-password-input').fill('senha123');
        await page.getByTestId('login-submit-button').click();

        await expect(page.getByTestId('sidebar-logout-btn')).toBeVisible({ timeout: 10000 });

        await page.getByTestId('sidebar-logout-btn').click();

        await expect(page.getByText('QA Vault Access')).toBeVisible();
    });

    test('should persist login state on page reload', async ({ page }) => {
        await page.getByTestId('login-user-select-Rafael').click();
        await page.getByTestId('login-password-input').fill('senha123');
        await page.getByTestId('login-submit-button').click();

        await expect(page.getByTestId('sidebar-logout-btn')).toBeVisible({ timeout: 10000 });

        await page.reload();

        await expect(page.getByTestId('sidebar-logout-btn')).toBeVisible({ timeout: 10000 });
    });
});
