import { test as base, expect, type Page } from '@playwright/test';


type Fixtures = {homePage: Page };

export const test = base.extend<Fixtures>({
    homePage: async ({ page }, use) => {
     (page as any)._tag = 'HOME_TAG'

     await page.goto('https://demo.playwright.dev/todomvc/#/')

     await use(page);
    }
});

export { expect };