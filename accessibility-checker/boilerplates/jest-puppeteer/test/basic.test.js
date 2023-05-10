'use strict';

const Puppeteer = require("puppeteer");
let browser;
beforeAll(async () => {
    try {
        browser = await Puppeteer.launch({ headless: false});
    } catch (e) {
        console.log(e);
    }
    return Promise.resolve();
});

afterAll(async() => {
    await browser.close();
    return Promise.resolve();
});

// Describe this Suite of testscases, describe is a test Suite and 'it' is a testcase.
describe('Altoro Mutual', () => {
    let page;
    beforeAll(async () => {
        page = await browser.newPage();
        await page.goto('http://altoromutual.com/');
    });

    afterAll(async () => {
        return page.close();
    });

    it('should be titled "Altoro Mutual"', async () => {
        await expect(page.title()).resolves.toMatch('Altoro Mutual');
    });

    it ('should be accessible', async() => {
        await expect(page).toBeAccessible("ALTORO_HOME");
    })

    describe('"Personal" page', () => {
        beforeAll(async () => {
            await page.click("#LinkHeader2");
        });
        
        it ('should be accessible', async() => {
            await expect(page).toBeAccessible("ALTORO_PERSONAL");
        })
    });

    // describe('"Small Business" page', () => {
    //     beforeAll(async () => {
    //         await page.click("#LinkHeader3");
    //     });
        
    //     it ('should be accessible', async() => {
    //         await expect(page).toBeAccessible("ALTORO_SMALLBUSINESS");
    //     })
    // });
});

