import type {Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test'

export class LoginPage {
    private readonly page:Page;
    private readonly userInput: Locator;
    private readonly passInput: Locator;
    private readonly loginBtn: Locator;

    constructor(page:Page){
        this.page = page;
        this.userInput = page.locator('#user-name')
        this.passInput = page.locator('#password')
        this.loginBtn = page.locator('#login-button')
    }

    async goto(baseUrl = 'https://www.saucedemo.com/v1/index.html'): Promise<void>{
        const url = baseUrl
        await this.page.goto(url, {waitUntil: 'load'})
        await expect(this.passInput).toBeVisible();
    }

    async signIn({user, pwd}: {user:string; pwd: string;}): Promise<void>{
        await this.userInput.fill(user);
        await this.loginBtn.fill(pwd);
        await Promise.all([
            this.page.waitForNavigation({url: '**', timeout:3000}),
            this.loginBtn.click()
        ])
    }
}