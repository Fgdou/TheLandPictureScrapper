import { connect } from 'puppeteer-real-browser';
import * as fs from 'fs'

const username = ''
const password = ''

if(username === '') throw new Error("Please fill the username")
if(password === '') throw new Error("Please fill the password")

const { page, browser } = await connect({
    headless: false,

        args: [],

        customConfig: {},

        turnstile: true,

        connectOption: {},

        disableXvfb: true,
        ignoreAllFlags: false
})



// Navigate the page to a URL.
await page.goto('https://the-land.ymag.cloud');


// Set screen size.
await page.setViewport({width: 1200, height: 900});
console.log("Starting...")

await page.waitForNavigation()
console.log("Page refreshed!")

await page.waitForNetworkIdle()

await page.waitForSelector('#login');
console.log("Login found!")

// Type into search box.
await page.type('#login', username);
await page.type('#password', password);
await page.realClick('#btnSeConnecter')

await page.waitForNavigation()

await page.waitForNetworkIdle()

for(let i=49000; i<49100; i++){
    console.log(i);

    let url = `https://the-land.ymag.cloud/index.php/apprenant/photo/150/${i}`
    let filename = `./pictures/${i}.jpeg`

    let page = await browser.newPage();

    const response = await page.goto(url);
    const imageBuffer = await response.buffer()
    await fs.promises.writeFile(filename, imageBuffer)
    await page.close();
}

await browser.close();
