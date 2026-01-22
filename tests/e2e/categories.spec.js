import { test, expect } from '../fixtures/test-fixtures.js';

test.describe('Category Management with Mocked Backend', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('login-user-select-Rafael').click();
        await page.getByTestId('login-password-input').fill('senha123');
        await page.getByTestId('login-submit-button').click();
        await expect(page.getByTestId('sidebar-logout-btn')).toBeVisible({ timeout: 10000 });
    });

    test('should display categories in sidebar', async ({ page }) => {
        await page.waitForTimeout(2000);

        // Should display category navigation items
        const categoryItems = page.locator('[data-testid^="sidebar-nav-"]');
        const count = await categoryItems.count();

        expect(count).toBeGreaterThan(0);
    });

    test('should open category manager modal', async ({ page }) => {
        await page.getByTestId('sidebar-manage-categories-btn').click();

        const modal = page.getByTestId('category-modal');
        await expect(modal).toBeVisible();
        await expect(page.getByText('Gerenciar Categorias')).toBeVisible();
    });

    test('should add new category', async ({ page }) => {
        await page.getByTestId('sidebar-manage-categories-btn').click();

        const categoryInput = page.getByTestId('category-input');
        const addButton = page.getByTestId('category-add-btn');

        await categoryInput.fill('04-Homologação');
        await addButton.click();

        await page.waitForTimeout(1000);

        // Input should be cleared
        await expect(categoryInput).toHaveValue('');
    });

    test('should not add empty category', async ({ page }) => {
        await page.getByTestId('sidebar-manage-categories-btn').click();

        const addButton = page.getByTestId('category-add-btn');

        // Button should be disabled when input is empty
        await expect(addButton).toBeDisabled();
    });

    test('should display existing categories in modal', async ({ page }) => {
        await page.getByTestId('sidebar-manage-categories-btn').click();

        await page.waitForTimeout(1000);

        // Should display category items from mock data
        const categoryItems = page.locator('[data-testid^="category-item-"]');
        await expect(categoryItems.first()).toBeVisible({ timeout: 5000 });
    });

    test('should display current project name in modal', async ({ page }) => {
        await page.getByTestId('sidebar-manage-categories-btn').click();

        // Should show "Projeto Atual:" label
        await expect(page.getByText('Projeto Atual:')).toBeVisible();
    });

    test('should close category manager modal', async ({ page }) => {
        await page.getByTestId('sidebar-manage-categories-btn').click();

        const modal = page.getByTestId('category-modal');
        await expect(modal).toBeVisible();

        // Press Escape to close
        await page.keyboard.press('Escape');

        await page.waitForTimeout(500);
    });

    test('should navigate between categories', async ({ page }) => {
        await page.waitForTimeout(2000);

        // Click on first category
        const firstCategory = page.locator('[data-testid^="sidebar-nav-"]').first();
        await firstCategory.click();

        await page.waitForTimeout(500);

        // Should still be in main app
        await expect(page.getByTestId('new-ata-btn')).toBeVisible();
    });
});
