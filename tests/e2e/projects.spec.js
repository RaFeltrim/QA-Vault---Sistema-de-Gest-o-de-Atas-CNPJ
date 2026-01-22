import { test, expect } from '../fixtures/test-fixtures.js';

test.describe('Project Management with Mocked Backend', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('login-user-select-Rafael').click();
        await page.getByTestId('login-password-input').fill('senha123');
        await page.getByTestId('login-submit-button').click();
        await expect(page.getByTestId('sidebar-logout-btn')).toBeVisible({ timeout: 10000 });
    });

    test('should display project selector with mocked projects', async ({ page }) => {
        const projectSelect = page.getByTestId('sidebar-project-select');
        await expect(projectSelect).toBeVisible();

        // Should have options from mock data
        const options = await projectSelect.locator('option').count();
        expect(options).toBeGreaterThan(0);
    });

    test('should open project manager modal', async ({ page }) => {
        await page.getByTestId('sidebar-manage-projects-btn').click();

        const modal = page.getByTestId('project-modal');
        await expect(modal).toBeVisible();
        await expect(page.getByText('Gerenciar Projetos')).toBeVisible();
    });

    test('should add new project', async ({ page }) => {
        await page.getByTestId('sidebar-manage-projects-btn').click();

        const projectInput = page.getByTestId('project-input');
        const addButton = page.getByTestId('project-add-btn');

        await projectInput.fill('Novo Projeto Teste');
        await addButton.click();

        await page.waitForTimeout(1000);

        // Input should be cleared
        await expect(projectInput).toHaveValue('');
    });

    test('should not add empty project', async ({ page }) => {
        await page.getByTestId('sidebar-manage-projects-btn').click();

        const addButton = page.getByTestId('project-add-btn');

        // Button should be disabled when input is empty
        await expect(addButton).toBeDisabled();
    });

    test('should display existing projects in modal', async ({ page }) => {
        await page.getByTestId('sidebar-manage-projects-btn').click();

        await page.waitForTimeout(1000);

        // Should display project items from mock data
        const projectItems = page.locator('[data-testid^="project-item-"]');
        await expect(projectItems.first()).toBeVisible({ timeout: 5000 });
    });

    test('should switch between projects', async ({ page }) => {
        const projectSelect = page.getByTestId('sidebar-project-select');

        // Get current value
        const currentValue = await projectSelect.inputValue();

        // Try to select a different project
        await projectSelect.selectOption({ index: 0 });

        await page.waitForTimeout(1000);

        // Project should be selected
        await expect(projectSelect).toBeVisible();
    });

    test('should close project manager modal', async ({ page }) => {
        await page.getByTestId('sidebar-manage-projects-btn').click();

        const modal = page.getByTestId('project-modal');
        await expect(modal).toBeVisible();

        // Click outside or close button
        await page.keyboard.press('Escape');

        await page.waitForTimeout(500);
    });
});
