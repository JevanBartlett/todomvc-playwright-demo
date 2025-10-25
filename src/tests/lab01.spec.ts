import { test , expect } from '../fixtures/home.js'
import type { Page } from '@playwright/test'
import { TodoPage } from '../pages/main/TodoPage.js'

const listTodos = [{todoText:'test1'}, {todoText:'test2'},{todoText:'test3'},]

test('homePage is just page after navigate', async ({homePage})=> {
const todoPage = new TodoPage(homePage)
await todoPage.addTodolist(listTodos)

const todoCount = await todoPage.getlistCount();
await expect(todoCount).toEqual(listTodos.length)

})

