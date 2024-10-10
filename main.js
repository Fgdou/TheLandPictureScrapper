import { connect } from 'puppeteer-real-browser';
import * as fs from 'fs'
import { exit } from 'process';

const baseUrl = "https://the-land.ymag.cloud"

console.log();
console.log(`Starting picture scrapper on ${baseUrl}`);

if(process.argv.length != 6) {
    console.error(`Usage: ${process.argv[0]} ${process.argv[1]} username password from-number to-number`)
    exit(1)
}

const username = process.argv[2]
const password = process.argv[3]

const [from, to] = [parseInt(process.argv[4]), parseInt(process.argv[5])];

if(isNaN(from) || isNaN(to) || from < 10000 || from > 100000 || to < 10000 || to > 100000) {
    console.error("from and to should be between 10000 and 100000")
    exit(1)
}

console.log(`Username: ${username}`)
console.log(`Going from ${from} to ${to} (${to-from} entries)`)
console.log(`Saving into ./pictures...`)

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
await page.goto(baseUrl);


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

for(let i=from; i<to; i++){
    console.log(i);

    let url = `${baseUrl}/index.php/apprenant/photo/150/${i}`
    let filename = `./pictures/${i}.jpeg`

    let page = await browser.newPage();

    const response = await page.goto(url);
    const imageBuffer = await response.buffer()
    await fs.promises.writeFile(filename, imageBuffer)
    await page.close();
}

await browser.close();
