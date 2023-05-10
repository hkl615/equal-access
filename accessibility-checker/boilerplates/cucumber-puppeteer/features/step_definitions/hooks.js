// Load required libraries

const Puppeteer = require('puppeteer');

async function getBrowserChrome() {
    try {
        let browser = await Puppeteer.launch({ headless: true});
        let page = await browser.newPage();
        return page;
    } catch (e) {
        console.log(e);
    }
    return Promise.resolve();
}

async function getBrowser() {
    return getBrowserChrome();
}


// features/step_definitions/hooks.js
let driver;
const {BeforeAll, AfterAll, Before} = require("cucumber");
    Before(function() {
        this.driver = driver;
    })

    AfterAll(function() {
        return driver.close();
    });

    BeforeAll(async () => {
        driver = await getBrowser();

        /*
        return new Promise(function(resolve, reject) {
            aChecker.onRunComplete(resolve);
        });
        */
    })
