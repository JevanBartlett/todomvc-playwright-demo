import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { clear } from 'console';

type Todo = {
    todoText: string
}


export class TodoPage {
    private readonly page: Page;
    private readonly newTodo: Locator; 
    constructor(page:Page) {
    this.page = page
    this.newTodo = this.page.getByRole('textbox', {name: "What needs to be done"})
    }

get list(): Locator {
    return this.page.locator('.todo-list')
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
async deleteSingletodo(data: Todo): Promise<void>{
    const item_to_delete = this.list.locator('li').filter({ has: this.page.locator('label', {hasText: data.todoText})});
    
    const delete_button = item_to_delete.getByRole('button', {name: "Delete"})
    await expect(item_to_delete).toHaveCount(1)
    await item_to_delete.hover()
    await delete_button.click();
    await expect(item_to_delete).toHaveCount(0) 

}

async deletelistTodo(data: Todo[]): Promise<void>{
    for (const todo of data){
       await this.deleteSingletodo(todo) 
    }

}

async completeTodo(data: Todo): Promise<void>{
    //const item_to_be_checked = this.list.locator('li').filter({ has: this.page.locator('label', {hasText: data.todoText})})
    const item_to_be_checked = this.list.locator('li', {hasText: data.todoText})
    await expect(item_to_be_checked).toHaveCount(1)
    const item_checkbox = item_to_be_checked.locator('input.toggle')
    await expect(item_checkbox).toBeVisible();
    await item_checkbox.check()
    await expect(item_checkbox).toBeChecked();

}

async completelistTodo(data:Todo[]): Promise<void>{
    for (const todo of data){
        await this.completeTodo(todo) 
     }
}


async clearAll(): Promise<void>{
    const clearallButton = this.page.getByRole('button', {name: "Clear Completed"})
    await clearallButton.click();
}

async getlistCount(): Promise<number>{
    return this.page.locator('.todo-list li').count();
}

async getlistitem(todo:Todo): Promise<Locator>{
    return this.page.getByTestId('todo-title').filter({hasText: todo.todoText})
}

async getcheckeditem(todo:Todo): Promise<Locator> {
    const item_to_be_checked = this.list.locator('li', {hasText: todo.todoText})
    return item_to_be_checked 
}

async filterby(filter:string): Promise<void>{
    const footer = this.page.locator('.todoapp .footer')
    const link = footer.getByRole('link', {name: filter})

    await link.click()
    await this.page.waitForURL('**/active')
}

}