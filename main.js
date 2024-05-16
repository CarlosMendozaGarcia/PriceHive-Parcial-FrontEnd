import { chromium } from 'playwright'

async function AlkostoItems(producto) {
    const browser = await chromium.launch({
        headless: false,
        slowMo: 2000
    })
    const page = await browser.newPage()

    await page.goto('https://www.alkosto.com')
    await page.waitForLoadState('domcontentloaded')
    await page.click(".js-site-search-input")
    await page.$eval('#js-site-search-input', (element, product) => {
        element.value = product
    }, producto)
    await page.keyboard.type(' ')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(2000)
    await browser.close()
}

async function OlimpicaItems(producto) {

    const browser = await chromium.launch({
        headless: false,
        slowMo: 2000
    })
    const page = await browser.newPage()

    await page.goto('https://www.olimpica.com')
    await page.waitForLoadState('domcontentloaded')
    await page.click("#downshift-7-input")
    await page.$eval('#downshift-7-input',
        (element, product) => {
            element.value = product
        }, producto)
    await page.keyboard.type(' ')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(2000)
    await browser.close()
}
/* 
const offers = await page.$$('.ais-InfiniteHits-item product__item js-product-item js-algolia-product-click')
const textOffers = await Promise.all(offers.map(async off => await off.innerHTML())) */
//AlkostoItems('Samsung Galaxy A54')
OlimpicaItems('Samsung Galaxy A54')
