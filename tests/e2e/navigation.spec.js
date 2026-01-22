import { test, expect } from '../fixtures/test-fixtures.js';

test.describe('Navigation and UI Elements', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('login-user-select-Rafael').click();
        await page.getByTestId('login-password-input').fill('senha123');
        await page.getByTestId('login-submit-button').click();
        await expect(page.getByTestId('sidebar-logout-btn')).toBeVisible({ timeout: 10000 });
    });

    test('should display all sidebar elements', async ({ page }) => {
        await expect(page.getByTestId('sidebar-project-select')).toBeVisible();
        await expect(page.getByTestId('sidebar-manage-projects-btn')).toBeVisible();
        await expect(page.getByTestId('sidebar-manage-categories-btn')).toBeVisible();
        await expect(page.getByTestId('sidebar-nav-drafts')).toBeVisible();
        await expect(page.getByTestId('sidebar-nav-whiteboard')).toBeVisible();
        await expect(page.getByTestId('sidebar-logout-btn')).toBeVisible();
    });

    test('should navigate to Drafts', async ({ page }) => {
        await page.getByTestId('sidebar-nav-drafts').click();

        await expect(page.getByTestId('drafts-textarea')).toBeVisible();
        await expect(page.getByTestId('header-title')).toContainText('Rascunho');
    });

    test('should navigate to Whiteboard', async ({ page }) => {
        await page.getByTestId('sidebar-nav-whiteboard').click();

        await expect(page.getByTestId('header-title')).toContainText('Whiteboard');
    });

    test('should display header elements', async ({ page }) => {
        await expect(page.getByTestId('header-title')).toBeVisible();
        await expect(page.getByTestId('search-input')).toBeVisible();
        await expect(page.getByTestId('import-file-btn')).toBeVisible();
        await expect(page.getByTestId('new-ata-btn')).toBeVisible();
    });

    test('should navigate back to list from drafts', async ({ page }) => {
        await page.getByTestId('sidebar-nav-drafts').click();
        await expect(page.getByTestId('drafts-textarea')).toBeVisible();

        // Click on a category to go back to list
        const firstCategory = page.locator('[data-testid^="sidebar-nav-"]').first();
        await firstCategory.click();

        await expect(page.getByTestId('new-ata-btn')).toBeVisible();
    });

    test('should maintain active state on navigation items', async ({ page }) => {
        await page.getByTestId('sidebar-nav-drafts').click();

        const draftsButton = page.getByTestId('sidebar-nav-drafts');
        await expect(draftsButton).toHaveClass(/bg-indigo-600/);
    });

    test('should display correct header title for each view', async ({ page }) => {
        // Default view
        let headerTitle = page.getByTestId('header-title');
        await expect(headerTitle).toBeVisible();

        // Drafts view
        await page.getByTestId('sidebar-nav-drafts').click();
        await expect(headerTitle).toContainText('Rascunho');

        // Whiteboard view
        await page.getByTestId('sidebar-nav-whiteboard').click();
        await expect(headerTitle).toContainText('Whiteboard');
    });
});
