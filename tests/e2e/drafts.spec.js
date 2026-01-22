import { test, expect } from '../fixtures/test-fixtures.js';

test.describe('Drafts Functionality with Persistence', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('login-user-select-Rafael').click();
        await page.getByTestId('login-password-input').fill('senha123');
        await page.getByTestId('login-submit-button').click();
        await expect(page.getByTestId('sidebar-logout-btn')).toBeVisible({ timeout: 10000 });
        await page.getByTestId('sidebar-nav-drafts').click();
    });

    test('should display drafts textarea', async ({ page }) => {
        const textarea = page.getByTestId('drafts-textarea');
        await expect(textarea).toBeVisible();
        await expect(textarea).toBeEditable();
    });

    test('should type and auto-save content', async ({ page }) => {
        const textarea = page.getByTestId('drafts-textarea');
        const testContent = 'Test draft content for project';

        await textarea.fill(testContent);

        await page.waitForTimeout(500);

        await expect(textarea).toHaveValue(testContent);
    });

    test('should persist content after navigation', async ({ page }) => {
        const textarea = page.getByTestId('drafts-textarea');
        const testContent = 'Persistent draft content';

        await textarea.fill(testContent);
        await page.waitForTimeout(500);

        // Navigate away
        await page.getByTestId('sidebar-nav-whiteboard').click();
        await page.waitForTimeout(500);

        // Navigate back
        await page.getByTestId('sidebar-nav-drafts').click();

        // Content should still be there
        await expect(textarea).toHaveValue(testContent);
    });

    test('should clear content', async ({ page }) => {
        const textarea = page.getByTestId('drafts-textarea');

        await textarea.fill('Content to clear');
        await page.waitForTimeout(500);

        await textarea.clear();

        await expect(textarea).toHaveValue('');
    });

    test('should handle large text content', async ({ page }) => {
        const textarea = page.getByTestId('drafts-textarea');
        const largeContent = 'Lorem ipsum dolor sit amet. '.repeat(100);

        await textarea.fill(largeContent);
        await page.waitForTimeout(500);

        await expect(textarea).toHaveValue(largeContent);
    });

    test('should persist across page reload', async ({ page }) => {
        const textarea = page.getByTestId('drafts-textarea');
        const testContent = 'Content that survives reload';

        await textarea.fill(testContent);
        await page.waitForTimeout(500);

        await page.reload();

        // Should still be logged in and on drafts
        await expect(page.getByTestId('drafts-textarea')).toBeVisible({ timeout: 10000 });
        await expect(page.getByTestId('drafts-textarea')).toHaveValue(testContent);
    });
});
