import { test, expect } from '../fixtures/test-fixtures.js';

test.describe('Complete Ata CRUD Operations', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('login-user-select-Rafael').click();
        await page.getByTestId('login-password-input').fill('senha123');
        await page.getByTestId('login-submit-button').click();
        await expect(page.getByTestId('sidebar-logout-btn')).toBeVisible({ timeout: 10000 });
    });

    test('should display ata list with mocked data', async ({ page }) => {
        // Wait for atas to load
        await page.waitForTimeout(2000);

        // Should display at least one ata from mock data
        const ataCards = page.locator('[data-testid^="ata-list-item-"]');
        await expect(ataCards.first()).toBeVisible({ timeout: 5000 });
    });

    test('should create new ata', async ({ page }) => {
        await page.getByTestId('new-ata-btn').click();

        await expect(page.getByTestId('editor-title-input')).toBeVisible();

        await page.getByTestId('editor-title-input').fill('Nova Ata de Teste');

        // Wait for editor to be ready
        await page.waitForTimeout(1000);

        await page.getByTestId('editor-save-btn').click();

        // Should return to list
        await expect(page.getByTestId('new-ata-btn')).toBeVisible({ timeout: 5000 });
    });

    test('should view ata details', async ({ page }) => {
        await page.waitForTimeout(2000);

        const firstAta = page.locator('[data-testid^="ata-list-item-"]').first();
        await firstAta.click();

        await expect(page.getByTestId('ata-detail-title')).toBeVisible({ timeout: 5000 });
        await expect(page.getByTestId('ata-action-edit')).toBeVisible();
        await expect(page.getByTestId('ata-action-delete')).toBeVisible();
    });

    test('should edit ata', async ({ page }) => {
        await page.waitForTimeout(2000);

        const firstAta = page.locator('[data-testid^="ata-list-item-"]').first();
        await firstAta.click();

        await expect(page.getByTestId('ata-detail-title')).toBeVisible({ timeout: 5000 });

        await page.getByTestId('ata-action-edit').click();

        await expect(page.getByTestId('editor-title-input')).toBeVisible();

        await page.getByTestId('editor-title-input').fill('Ata Editada');
        await page.getByTestId('editor-save-btn').click();

        await expect(page.getByTestId('new-ata-btn')).toBeVisible({ timeout: 5000 });
    });

    test('should add comment to ata', async ({ page }) => {
        await page.waitForTimeout(2000);

        const firstAta = page.locator('[data-testid^="ata-list-item-"]').first();
        await firstAta.click();

        await expect(page.getByTestId('comment-input')).toBeVisible({ timeout: 5000 });

        await page.getByTestId('comment-input').fill('Comentário de teste');
        await page.getByTestId('comment-submit-btn').click();

        await page.waitForTimeout(1000);

        // Input should be cleared
        await expect(page.getByTestId('comment-input')).toHaveValue('');
    });

    test('should search atas', async ({ page }) => {
        const searchInput = page.getByTestId('search-input');

        await searchInput.fill('Kickoff');

        await expect(searchInput).toHaveValue('Kickoff');

        await page.waitForTimeout(500);
    });

    test('should filter atas by category', async ({ page }) => {
        // Click on a category
        const firstCategory = page.locator('[data-testid^="sidebar-nav-"]').first();
        await firstCategory.click();

        await page.waitForTimeout(1000);

        // Should still see the list view
        await expect(page.getByTestId('new-ata-btn')).toBeVisible();
    });
});
