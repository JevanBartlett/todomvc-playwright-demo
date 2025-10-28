import { test , expect } from '../fixtures/home.js'
import type { Page } from '@playwright/test'
import { TodoPage } from '../pages/main/TodoPage.js'

const listTodos = [
    {todoText:'test1'}, 
    {todoText:'test2'},
    {todoText:'test3'}, 
    {todoText: "zoe finds this boring"}, 
    {todoText: "teagan also finds this dull"}
]

test.describe( "some playwright tests", () =>{


test('homePage is just page after navigate', async ({homePage})=> {
const todoPage = new TodoPage(homePage)
await todoPage.addTodolist(listTodos)

const todoCount = await todoPage.getlistCount();
expect(todoCount).toEqual(listTodos.length)

});

test('delete todo ', async ({homePage})=> {
const todoPage = new TodoPage(homePage)
await todoPage.addTodolist(listTodos)
await todoPage.deleteSingletodo({todoText: "test3"})
const deleted_todo= await todoPage.getlistitem({todoText: "test3"})
await expect(deleted_todo).toHaveCount(0)

});

test('complete todo', async({homePage}) => {
    const todoPage = new TodoPage(homePage)
    await todoPage.addTodolist(listTodos)
    await todoPage.completeTodo({todoText: "test2"})
    const completedtodo = await todoPage.getcheckeditem({todoText: "test2"})
    expect(completedtodo).toHaveClass('completed')
})

test('clear all complete', async({homePage}) => {
    const todoPage = new TodoPage(homePage)
    await todoPage.addTodolist(listTodos)
    await todoPage.completelistTodo(listTodos)
    await todoPage.clearAll();
    const listCount = await todoPage.getlistCount();
    expect(listCount).toBe(0)

})

test('filter todos by active', async ({homePage}) => {
    const todoPage = new TodoPage(homePage)
    await todoPage.addTodolist(listTodos)
    await todoPage.completelistTodo([{todoText:"test2"}, {todoText:"zoe finds this boring"}])
    await todoPage.filterby('active')
    
    const active_Todos = await todoPage.getlistCount()
    expect(active_Todos).toBe(3)



})


});
