import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'

type Todo = {
    todoText: string
}


export class TodoPage {
    private readonly page: Page;
    private readonly newTodo: Locator; 
    private readonly list: Locator;
    constructor(page:Page) {
    this.page = page
    this.newTodo = this.page.getByRole('textbox', {name: "What needs to be done"})
    this.list = this.page.locator('.todo-list')
    }
    
async addTodolist(listTodos: Todo[]): Promise<void> {
   
    for(const todo of listTodos){   
        await this.newTodo.fill(todo.todoText)
        await this.newTodo.press('Enter')
        const list_item = this.list.locator('li').filter({
            has: this.page.locator('label', { hasText: todo.todoText })
          });
        await expect(list_item).toBeVisible();
        await expect(list_item.locator('label')).toHaveText(todo.todoText);
    }
    
}
async deleteTodo(data: Todo): Promise<void>{
    const item_to_delete = this.list.locator('li').filter({ has: this.page.locator('label', {hasText: data.todoText})}).first();
    const delete_button = item_to_delete.getByRole('button', {name: "Delete"})
    await expect(item_to_delete).toHaveCount(1)
    await item_to_delete.hover()
    await delete_button.click();
    await expect(item_to_delete).toHaveCount(0) 

}

async completeTodo(data: Todo): Promise<void>{
    const item_to_be_checked = this.list.locator('li').filter({ has: this.page.locator('label', {hasText: data.todoText})}).first();
    await expect(item_to_be_checked).toHaveCount(1)
    const item_checkbox = item_to_be_checked.getByRole('checkbox', {name:data.todoText })
    await item_checkbox.check()
    await expect(item_to_be_checked).toBeChecked();

}

async clearAll(): Promise<void>{

}

async getlistCount(): Promise<number>{
    return this.page.locator('.todo-list li').count();
}

}