import { expect, test } from '../fixtures/home.js';

import { TodoPage } from '../pages/main/TodoPage.js';

const listTodos = [
  { todoText: 'test1' },
  { todoText: 'test2' },
  { todoText: 'test3' },
  { todoText: 'zoe finds this boring' },
  { todoText: 'teagan also finds this dull' },
];

test.describe('some playwright tests', { tag: '@smoke' }, () => {
  test('homePage is just page after navigate', async ({ homePage }) => {
    const todoPage = new TodoPage(homePage);
    await todoPage.addTodolist(listTodos);
    const todoCount = await todoPage.getlistCount();

    expect(todoCount).toEqual(listTodos.length);
  });

  test('delete todo', async ({ homePage }) => {
    const todoPage = new TodoPage(homePage);
    await todoPage.addTodolist(listTodos);
    await todoPage.deleteSingletodo({ todoText: 'test3' });
    const deleted_todo = todoPage.getlistitem({ todoText: 'test3' });
    await expect(deleted_todo).toHaveCount(0);
  });

  test('complete todo', async ({ homePage }) => {
    const todoPage = new TodoPage(homePage);
    await todoPage.addTodolist(listTodos);
    await todoPage.completeTodo({ todoText: 'test2' });
    const completedtodo = todoPage.getcheckeditem({ todoText: 'test2' });
    await expect(completedtodo).toHaveClass('completed');
  });

  test('clear all complete', async ({ homePage }) => {
    const todoPage = new TodoPage(homePage);
    await todoPage.addTodolist(listTodos);
    await todoPage.completelistTodo(listTodos);
    await todoPage.clearAll();
    await expect(todoPage.visible_list).toHaveCount(0);
  });

  test('filter todos by active', async ({ homePage }) => {
    const todoPage = new TodoPage(homePage);
    await todoPage.addTodolist(listTodos);
    await todoPage.completelistTodo([{ todoText: 'test2' }, { todoText: 'zoe finds this boring' }]);
    await todoPage.filterby('Active');

    await expect(todoPage.visible_list).toHaveCount(3);
  });
});
