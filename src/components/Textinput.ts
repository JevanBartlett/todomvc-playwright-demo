import { Locator, expect, Page } from '@playwright/test'

interface TextInputOptions {
    timeout?: number;
    validateValue?: boolean;
    clearFirst?: boolean;
}

class Textinput {
    private readonly locator:Locator;
    private readonly description:string;

    constructor(locator:Locator, description: string)  {
        this.locator = locator;
        this.description = description
    }

    async fill(value: string, options: TextInputOptions = {}): Promise<void> {
        const {
            timeout = 5000,
            validateValue = true,
            clearFirst = true,
        } = options;

        try {
            await expect(this.locator, `${this.description} should be visible`).toBeVisible({timeout})

            await expect(this.locator, `${this.description} should be enabled`).toBeEnabled({timeout});
            
            if (clearFirst) {
                await this.locator.clear();
            }

            await this.locator.fill(value);

            if (validateValue) {
                await expect(this.locator, `${this.description} should contain value "${value}"`)
                .toHaveValue(value, {timeout });
            }
        } catch (error) {
            throw new Error(`Failed to fill ${this.description} with value "${value}": ${error.message}`)
        }
    }

    async getValue(): Promise<string> {
        return await this.locator.inputValue();
    }

    async hasError(): Promise<boolean> {
        const ariaInvalid = await this.locator.getAttribute('aria-invalid')
        const hasErrorClass = await this.locator.evaluate(el => el.classList.contains('error') || el.classList.contains('invalid'));
        return ariaInvalid === 'true' || hasErrorClass
    }
    
}