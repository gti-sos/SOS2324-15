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

test('create a data', async ({ page }) => {
  // Ir a la página localhost:10000/wris-datasets.
  await page.goto('http://localhost:10000/performance-dataset');

  // Rellenamos algun campo (wri) id="newWri" con un dato.
  await page.locator('#newWri').fill('99.9');

  // Pulsamos el botón 'Crear un nuevo dato'.
  await page.getByRole('button', { name: /Crear un nuevo dato/ }).click();

  // Pulsamos el botón 'Página siguiente'.
  await page.getByRole('button', { name: /Página siguiente/ }).click();

  // Esperamos más de un elemento en la lista.
  let dataCounter = (await page.locator('.objetoDeLista').all()).length;

  expect(dataCounter).toBeGreaterThan(0);

  // Pulsamos el botón 'Página anterior'.
  await page.getByRole('button', { name: /Página anterior/ }).click();

  // Esperamos más de 9 elementos en la lista (ya que hay más de una pág).
  let dataCounter2 = (await page.locator('.objetoDeLista').all()).length;

  expect(dataCounter2).toBeGreaterThan(9);
});
