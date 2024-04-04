// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('http://localhost:10000/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/API Rest Grupo 15/);
});

test('list countries and age', async ({ page }) => {
  await page.goto('http://localhost:10000/performance-dataset/');

  await page.waitForTimeout(2000);

  // Expects the number of students to be more than 0
  let studentCount =  (await page.locator('.studentItem').all()).length;  
  expect(studentCount).toBeGreaterThan(0);
});


//package
//"pretest": "npm start &",
// "posttest": "kill `ps -uax | grep \"node index\" | grep -v \"grep\" | grep -v \"sh\" | awk '{print $2}'`"
//me tiro por un puente