import { test, expect } from '@playwright/test';
import { boardGameProducts } from '../boardgamedata';



// Check to see if connection to product page is successfull //
test('connection', async ({ page }) => {
  for (const boardGame of boardGameProducts) {
    try {
      await page.goto(boardGame.gameUrl)
      console.log(`Landed on ${boardGame.gameTitle} product page.`)
    } catch (error) {
      console.log(`Could not connect to ${boardGame.gameTitle} product page.`)
      console.error
    }
  }
});

// Check if product page has board game name in page title to ensure on correct page //
test('has title', async ({ page }) => {
  for (const boardGame of boardGameProducts) {
    await page.goto(boardGame.gameUrl)  // Navigate to product page 
    const pageTitle = await page.title() // Get page title 
    console.log(`Board Game product page = "${pageTitle}"`)
    const hasGameTitle = pageTitle.includes(boardGame.gameTitle)  // Check that pageTitle includes gameTitle 
    console.log(`Does pageTitle include "${boardGame.gameTitle}"?`)
    console.log(hasGameTitle) // Log true/false 
    expect(hasGameTitle).toBeTruthy() // Expect to be true 
  }
});

// Check to ensure page.locator can find span.priceToPay. If this test fails, the element/class could have changed. //
test('priceToPay exists', async ({ page }) => {
  for (const boardGame of boardGameProducts) {
    await page.goto(boardGame.gameUrl) // Navigate to product page 
    const priceElement = page.locator('span.priceToPay').nth(0) // Locate the first span element with price info
    const isVisible = await priceElement.isVisible(); // Check if priceElement exists and is visible as a DOM node
    try {
      if (isVisible) {
        console.log(`Price element on "${boardGame.gameTitle}" product page is ${isVisible}.`)
      } else {
        console.log(`Price element on "${boardGame.gameTitle}" product page is ${isVisible} but might not be visible.`)
      }
    } catch (error) {
      console.error(`Price element on "${boardGame.gameTitle}" is ${isVisible}.`)
    }
    expect(isVisible).toBeTruthy(); // Expect to be true 
  }
});








