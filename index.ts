const { chromium } = require("playwright");

async function getBoardGamePrices() {
    // launch browser 
    const browser = await chromium.launch({ headless: false })
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to product page 
    try {
        await page.goto("https://www.amazon.co.uk/Stonemaier-Games-Wyrmspan-Players-Minutes/dp/B0CJXNW71N/ref=sr_1_5?crid=120Z7NHDBPNHG&dib=eyJ2IjoiMSJ9.QF_5IqwMwtyGdkHhoqH7kmG83P5SVDLuroiu9g2H_DASnQKbYa5tTPQ8I5rqjUG_oqvOz2dP_3M9uhk-Jb4-EU4cYBHveCX2N56aCxG-8Q-C65NToDn-R7A9tTTilmbtBS6avBNiT3ZM6yA4Glslm05Kq3px6WC858556PqFL0Y5LgJdU-ICBimdft_tGYW33cHBFCMGwjwJMtAzyZtFetv272YtqnWJXmplNUR_WfZ3rE3ru-xvf9MG0UWkibpJAmBrTKroY-xzh_HaWhU7R-lzGCyKUWa8d3SUCk_b7oc.sy_9hFtnD5W9zKhuqhCpW4-mhmqJwhhOJ9aSY3S7bJE&dib_tag=se&keywords=wyrmspan%2Bboard%2Bgame&qid=1715681953&sprefix=wyrmspa%2Caps%2C103&sr=8-5&th=1", { timeout: 2 * 60 * 1000 });
    } catch (error) {
        if (error.name === 'TimeoutError' || error.message.includes('NetworkError')) {
            console.error('Failed to establish connection to Hacker News. (Network Error)');
            throw new Error("Failed to establish connection. Aborting...")
        }
    }
    console.log('Connected to Amazon product page!')


    // Check if product is on sale.

    try {
        // If product is on sale, get sale price, normal price & percentage discount
        if (page.locator('span.savingPriceOverride')) {
            console.log("Product IS on sale")
            // Get sale price
            try {
                const salePriceWholeElement = page.locator('span.priceToPay')
                const salePrice = await salePriceWholeElement.textContent()
                console.log("Sale Price =", salePrice)
            } catch (error) {
                console.error
                throw new Error("Could not find sale price. salePriceWholeElement may have been renamed.")
            }
            // Get normal price
            try {
                const textPriceElement = page.locator('span.basisPrice .a-offscreen')
                const normalPrice = await textPriceElement.textContent()
                console.log("Normal Price =", normalPrice)
            } catch (error) {
                console.error
                throw new Error("Could not find normal price. textPriceElement may have been renamed.")
            }
            try {
                const savingsPercentageElement = page.locator('span.savingsPercentage')
                const savingsPercentage = await savingsPercentageElement.textContent()
                console.log('Saving Percentage =', savingsPercentage)
            } catch (error) {
                console.error
                throw new Error("Could not identify sale percentage. savingsPercentage may have been renamed.")
            }




        }
    } catch (error) {
        console.error
        throw new Error("Could not identify if product is on sale. savingPriceOverride may have been renamed.")
    }


}

getBoardGamePrices()