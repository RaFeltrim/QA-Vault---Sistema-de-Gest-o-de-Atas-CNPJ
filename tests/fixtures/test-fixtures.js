import { test as base } from '@playwright/test';
import { mockProjects, mockCategories, mockAtas } from '../fixtures/mock-data.js';

export const test = base.extend({
    // Auto-mock Supabase requests for all tests
    page: async ({ page }, use) => {
        // Mock projects endpoint
        await page.route('**/rest/v1/projects*', async (route) => {
            const url = route.request().url();
            const method = route.request().method();

            if (method === 'GET') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockProjects)
                });
            } else if (method === 'POST') {
                const postData = route.request().postDataJSON();
                const newProject = {
                    id: `proj-${Date.now()}`,
                    ...postData,
                    created_at: new Date().toISOString()
                };
                await route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    body: JSON.stringify([newProject])
                });
            } else if (method === 'DELETE') {
                await route.fulfill({
                    status: 204
                });
            } else {
                await route.continue();
            }
        });

        // Mock categories endpoint
        await page.route('**/rest/v1/categories*', async (route) => {
            const url = route.request().url();
            const method = route.request().method();

            if (method === 'GET') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockCategories)
                });
            } else if (method === 'POST') {
                const postData = route.request().postDataJSON();
                const newCategory = {
                    id: `cat-${Date.now()}`,
                    ...postData,
                    created_at: new Date().toISOString()
                };
                await route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    body: JSON.stringify([newCategory])
                });
            } else if (method === 'DELETE') {
                await route.fulfill({
                    status: 204
                });
            } else {
                await route.continue();
            }
        });

        // Mock atas endpoint
        await page.route('**/rest/v1/atas*', async (route) => {
            const url = route.request().url();
            const method = route.request().method();

            if (method === 'GET') {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(mockAtas)
                });
            } else if (method === 'POST') {
                const postData = route.request().postDataJSON();
                const newAta = {
                    id: `ata-${Date.now()}`,
                    ...postData,
                    created_at: new Date().toISOString()
                };
                await route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    body: JSON.stringify([newAta])
                });
            } else if (method === 'PATCH') {
                const postData = route.request().postDataJSON();
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify([{ ...postData, id: 'ata-1' }])
                });
            } else if (method === 'DELETE') {
                await route.fulfill({
                    status: 204
                });
            } else {
                await route.continue();
            }
        });

        await use(page);
    },
});

export { expect } from '@playwright/test';
