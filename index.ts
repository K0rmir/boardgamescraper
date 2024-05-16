const { chromium } = require("playwright");
import { boardGameData, boardGameSaleInfo } from './boardgamedata';

async function getBoardGamePrices() {
    // launch browser 
    const browser = await chromium.launch({ headless: false })
    const context = await browser.newContext();
    const page = await context.newPage();

    const gamesOnSaleArr: boardGameSaleInfo[] = []

    // Navigate to product page 

    for (const boardGame of boardGameData) {

        let priceString: string;
        let price: number;
        let listPriceString: string
        let listPrice: number;

        // Connect to each product page //

        try {
            await page.goto(boardGame.gameUrl, { timeout: 2 * 60 * 1000 });
        } catch (error) {
            if (error.name === 'TimeoutError' || error.message.includes('NetworkError')) {
                console.error('Failed to establish connection to Amazon. (Network Error)');
                throw new Error("Failed to establish connection. Aborting...")
            }
        }
        console.log(`Connected to ${boardGame.gameTitle} Amazon product page!`)

        // Get current price //
        try {
            const priceElement = page.locator('span.priceToPay').nth(0)
            priceString = await priceElement.textContent({ timeout: 3000 })
            price = parseFloat(priceString.replace(/£/, ''))
            console.log(`Current Price = £${price}`)
        } catch (error) {
            console.error
            throw new Error("Could not find sale price. priceToPay may have been renamed.")
        }
        // Get list price //

        try {
            listPriceString = await page.locator('span.basisPrice .a-offscreen').nth(0).textContent({ timeout: 3000 })
            listPrice = parseFloat(listPriceString.replace(/£/, ''))
            console.log(`List Price = £${listPrice}`)
        } catch (error) {
            listPrice = price
            console.log(`List Price = £${listPrice}`)
            console.error(`${boardGame.gameTitle} is NOT on sale.`)
        }

        // Calculate % off //

        const difference = listPrice - price
        const percentageDifference = Math.ceil((difference / listPrice) * 100)
        console.log(`${boardGame.gameTitle} is %${percentageDifference} off.`)

        // Define new individualBoardGame object

        const individualBoardGame: boardGameSaleInfo = {
            gameTitle: boardGame.gameTitle,
            gameUrl: boardGame.gameUrl,
            price: price,
            listPrice: listPrice,
            percentageSaving: percentageDifference
        }

        // Determine whether or not game is on sale by checking if current price is less than list price. Push object to gamesonSaleArr if true. //

        if (price < listPrice) {
            console.log(` ${boardGame.gameTitle} IS on sale.`)
            gamesOnSaleArr.push(individualBoardGame)
            // console.log(`These games are on sale: ${gamesOnSaleArr}`)
        }
    }

    console.log(gamesOnSaleArr)

    await browser.close();
}

getBoardGamePrices()

// <(^.^)> //
