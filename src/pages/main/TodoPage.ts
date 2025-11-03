import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

type Todo = {
  todoText: string;
};

export class TodoPage {
  private readonly page: Page;
  private readonly newTodo: Locator;
  constructor(page: Page) {
    this.page = page;
    this.newTodo = this.page.getByRole('textbox', { name: 'What needs to be done' });
  }

  get list(): Locator {
    return this.page.locator('.todo-list');
  }

  get visible_list(): Locator {
    return this.page.locator('.todo-list li:visible');
  }

  async addTodolist(listTodos: Todo[]): Promise<void> {
    for (const todo of listTodos) {
      await this.newTodo.fill(todo.todoText);
      await this.newTodo.press('Enter');
      const list_item = this.list.locator('li').filter({
        has: this.page.locator('label', { hasText: todo.todoText }),
      });
      await expect(list_item).toBeVisible();
      await expect(list_item.locator('label')).toHaveText(todo.todoText);
    }
  }
  async deleteSingletodo(data: Todo): Promise<void> {
    const item_to_delete = this.list
      .locator('li')
      .filter({ has: this.page.locator('label', { hasText: data.todoText }) });

    const delete_button = item_to_delete.getByRole('button', { name: 'Delete' });
    await expect(item_to_delete).toHaveCount(1);
    await item_to_delete.hover();
    await delete_button.click();
    await expect(item_to_delete).toHaveCount(0);
  }

  async deletelistTodo(data: Todo[]): Promise<void> {
    for (const todo of data) {
      await this.deleteSingletodo(todo);
    }
  }

  async completeTodo(data: Todo): Promise<void> {
    const item_to_be_checked = this.list.locator('li', { hasText: data.todoText });
    await expect(item_to_be_checked).toHaveCount(1);
    const item_checkbox = item_to_be_checked.locator('input.toggle');
    await expect(item_checkbox).toBeVisible();
    await item_checkbox.check();
    await expect(item_checkbox).toBeChecked();
    await expect(item_to_be_checked).toHaveClass('completed');
  }

  async completelistTodo(data: Todo[]): Promise<void> {
    for (const todo of data) {
      await this.completeTodo(todo);
    }
  }

  async clearAll(): Promise<void> {
    const clearallButton = this.page.getByRole('button', { name: 'Clear Completed' });
    await clearallButton.click();

    try {
      await this.page.locator('.todo-list li.completed').first().waitFor({ state: 'detached' });
    } catch (error) {
      if (error instanceof Error) {
        console.warn('No completed items found to clear:', error.message);
      }
    }
  }

  async getlistCount(): Promise<number> {
    try {
      // Wait for Playwright's auto-waiting to stabilize the count
      await this.visible_list.waitFor({ state: 'attached' });
      // If there are no todos, catch the error and return 0
    } catch (error) {
      // If list doesn't exist, log it but continue
      if (error instanceof Error) {
        console.warn('List not found:', error.message);
      }
      // Return 0 if list doesn't exist
      return 0;
    }
    return await this.visible_list.count();
  }

  getlistitem(todo: Todo): Locator {
    return this.page.getByTestId('todo-title').filter({ hasText: todo.todoText });
  }

  getcheckeditem(todo: Todo): Locator {
    const item_to_be_checked = this.list.locator('li', { hasText: todo.todoText });
    return item_to_be_checked;
  }

  async filterby(filter: 'All' | 'Active' | 'Completed'): Promise<void> {
    const urlMap = {
      All: '**/',
      Active: '**/active',
      Completed: '**/completed',
    };

    const footer = this.page.locator('.todoapp .footer');
    const link = footer.getByRole('link', { name: filter });

    await link.click();
    await this.page.waitForURL(urlMap[filter]);
    await this.page.waitForLoadState('networkidle');
    await this.page.locator('.todo-list li:visible').first().waitFor();
  }
}
