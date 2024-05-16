const { chromium } = require("playwright");
import { boardGameData } from './boardgamedata';

async function getBoardGamePrices() {
    // launch browser 
    const browser = await chromium.launch({ headless: false })
    const context = await browser.newContext();
    const page = await context.newPage();

    const gamesOnSaleArr: string[] = []

    // Navigate to product page 

    for (const boardGame of boardGameData) {

        let priceString: string;
        let price: number;
        let listPriceString: string
        let listPrice: number;

        try {
            await page.goto(boardGame.gameUrl, { timeout: 2 * 60 * 1000 });
        } catch (error) {
            if (error.name === 'TimeoutError' || error.message.includes('NetworkError')) {
                console.error('Failed to establish connection to Amazon. (Network Error)');
                throw new Error("Failed to establish connection. Aborting...")
            }
        }
        console.log(`Connected to ${boardGame.gameTitle} Amazon product page!`)

        // Get current price
        try {
            const priceElement = page.locator('span.priceToPay').nth(0)
            priceString = await priceElement.textContent({ timeout: 3000 })
            price = parseFloat(priceString.replace(/£/, ''))
            console.log("Current Price =", price)
        } catch (error) {
            console.error
            throw new Error("Could not find sale price. priceToPay may have been renamed.")
        }
        // Get list price

        try {
            listPriceString = await page.locator('span.basisPrice .a-offscreen').nth(0).textContent({ timeout: 3000 })
            listPrice = parseFloat(listPriceString.replace(/£/, ''))
            console.log('List Price =', listPrice)
        } catch (error) {
            listPrice = price
            console.log('List Price =', listPrice)
            console.error('Game not on sale.')
        }

        // Determine whether or not product is on sale by checking if current price is less than list price //

        if (price < listPrice) {
            console.log('Game on sale.')
            gamesOnSaleArr.push(boardGame.gameTitle)
            console.log(`These games are on sale: ${gamesOnSaleArr}`)
        }
    }
}

getBoardGamePrices()

// hello there //
