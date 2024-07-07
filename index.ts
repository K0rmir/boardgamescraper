import { boardGameProducts, boardGameData } from './boardgamedata';

const { chromium } = require("playwright");
const nodemailer = require("nodemailer");
const fs = require("node:fs");
const ejs = require("ejs");
require('dotenv').config();
require("process");

// Declare array to used for games on sale using interface //

const gamesOnSaleArr: boardGameData[] = []

async function getBoardGamePrices() {
    // launch browser 
    const browser = await chromium.launch({ headless: true })
    const context = await browser.newContext();
    const page = await context.newPage();

    // Loop through each game in boardGameProducts array //
    for (const boardGame of boardGameProducts) {

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
        // console.log(`Connected to ${boardGame.gameTitle} Amazon product page!`)

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
            // console.log(`List Price = £${listPrice}`)
        } catch (error) {
            listPrice = price
            // console.log(`List Price = £${listPrice}`)
            // console.error(`${boardGame.gameTitle} is NOT on sale.`)
        }

        // Calculate % off //
        const difference = listPrice - price
        const percentageDifference = Math.ceil((difference / listPrice) * 100)
        // console.log(`${boardGame.gameTitle} is %${percentageDifference} off.`)

        // Define new individualBoardGame object
        const individualBoardGame: boardGameData = {
            gameTitle: boardGame.gameTitle,
            gameUrl: boardGame.gameUrl,
            price: price,
            listPrice: listPrice,
            percentageSaving: percentageDifference
        }

        // Determine whether or not game is on sale by checking if current price is less than list price. Push object to gamesonSaleArr if true. //
        if (price < listPrice) {
            // console.log(` ${boardGame.gameTitle} IS on sale.`)
            gamesOnSaleArr.push(individualBoardGame)
        }
    }

    // console.log(gamesOnSaleArr)

    // Close playwright chromium browser //
    await browser.close();

    // Send email if there are any games on sale //
    if (gamesOnSaleArr.length > 0) {
        try {
            sendEmail()
        } catch (error) {
            console.error("Unable to send Email")
            console.error(error)
        }
    }
}

async function sendEmail() {
    // configure where the email is sent from (https://support.google.com/mail/answer/7104828?hl=en&ref_topic=7280141&sjid=5865078254559136309-EU) //
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });

    const renderedHtml = await fs.promises.readFile('emailTemplate.ejs', 'utf8');
    const template = ejs.compile(renderedHtml); // Compile EJS template //
    const html = template({ gamesOnSaleArr }) // Pass desired data to template to be rendered in email //

    // function to send email //
    const message = await transporter.sendMail({
        from: `Kormir <kormir.dev@gmail.com>`,
        to: 'kormir.dev@gmail.com',
        subject: 'Board Game Offers',
        html: html,
    });
    // console.log("Email sent! Check your indox. " + message.messageId)
}

getBoardGamePrices()
