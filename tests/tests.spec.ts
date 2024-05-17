import { test, expect } from '@playwright/test';
import { boardGameProducts } from '../boardgamedata';

// const { boardGameData } = require('boardgamedata.ts')

// Check if URL contains the board game name 
test('has title', async ({ page }) => {

  for (const boardGame of boardGameProducts) {
    await page.goto(boardGame.gameUrl)
    console.log(boardGame.gameUrl)
    const pageTitle = await page.title()
    console.log(pageTitle)

    const hasGameTitle = pageTitle.includes(boardGame.gameTitle)

    console.log(hasGameTitle)

    expect(hasGameTitle).toBeTruthy()

    console.log(boardGame.gameTitle)
  }
});

// Check if the product is on sale
test('is on sale', async ({ page }) => {

  await page.goto('https://www.amazon.co.uk/Starling-Games-Everdell-Bellfaire/dp/B07YVMSCSV/ref=sr_1_1?sr=8-1');
  // Expect the 'savingPriceOverride' element to exist, indicating the product is on sale. 

  const saleElement = page.locator('span.savingsPercentage')

  expect(saleElement).toBeFalsy()
})






