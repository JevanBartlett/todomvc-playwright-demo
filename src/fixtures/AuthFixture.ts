// ESM + TS + Playwright, no require()

// import { test as base, type Page } from '@playwright/test';
// import { readFile } from 'node:fs/promises';        // async FS API
// import { join, dirname } from 'node:path';          // path helpers
// import { fileURLToPath } from 'node:url';           // to emulate __dirname in ESM
// import { LoginPage } from '../pages/main/LoginPage.js';
// // this is a fixture type.  it extends page? because we are handing it a logged in page?
// type AuthFixture = {
//     page: Page
// }

// export type Role = 'base-user'

// type TargetEnv = 'sit' | 'uat';

// const credsJson = JSON.parse(
//     fs.readFileSync(path.join(__dirname, '../config/creds.json'), 'utf-8')
// ) as Record<Role, {userEnv:string; pdwEn: string}>;

// function credsFor(role:Role) {
//     const {userEnv, pwdEnv} = credsJson(role);

//     // what does process.env signify? 
//     const user = process.env[userEnv]
//     const pwd = process.env[pwdEnv];
//     if(!user || !pwd ) throw new Error('Missing env/pwd:' ${userEnv} ${pwdEnv});
//     return {user,pwd}
// }

// export const test = base.extend<{
//     page: AuthFixture; 
//     role: Role;
//     targetEnv: TargetEnv;
// }>({
//     role: ['base-user', {option: true}],
//     targetEnv: ['uat', {option: true}],

//     page: async ({ browser, role, targetEnv }, use)=> {
//     const context= await browser.newContext();
//     const page = await context.newPage();
//     const baseURL = targetEnv === 'uat' ? process.env.UAT.URL! : process.env.SIT.URL!;
//     const lp = new LoginPage(page);
//     await lp.goto(baseURL);
//     await lp.signIn(credsFor(role))
//     await use(page);
//     await context.close();
//     }
// })