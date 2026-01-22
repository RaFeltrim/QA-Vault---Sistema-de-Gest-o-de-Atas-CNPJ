import { test, expect } from '../fixtures/test-fixtures.js';

test.describe('Whiteboard Functionality', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('login-user-select-Rafael').click();
        await page.getByTestId('login-password-input').fill('senha123');
        await page.getByTestId('login-submit-button').click();
        await expect(page.getByTestId('sidebar-logout-btn')).toBeVisible({ timeout: 10000 });
        await page.getByTestId('sidebar-nav-whiteboard').click();
    });

    test('should display whiteboard view', async ({ page }) => {
        await expect(page.getByTestId('header-title')).toContainText('Whiteboard');
    });

    test('should load Excalidraw canvas', async ({ page }) => {
        // Wait for Excalidraw to load
        const excalidrawCanvas = page.locator('.excalidraw, canvas').first();
        await expect(excalidrawCanvas).toBeVisible({ timeout: 15000 });
    });

    test('should have full-screen layout', async ({ page }) => {
        const main = page.locator('main');
        const classes = await main.getAttribute('class');

        // Should not have p-6 class when whiteboard is active
        expect(classes).not.toContain('p-6');
    });

    test('should navigate away from whiteboard', async ({ page }) => {
        await page.getByTestId('sidebar-nav-drafts').click();

        await expect(page.getByTestId('drafts-textarea')).toBeVisible();
    });

    test('should return to whiteboard', async ({ page }) => {
        await page.getByTestId('sidebar-nav-drafts').click();
        await page.waitForTimeout(500);

        await page.getByTestId('sidebar-nav-whiteboard').click();

        await expect(page.getByTestId('header-title')).toContainText('Whiteboard');
    });
});
