const { validation } = require('../functions/functions')

const { chromium } = require('playwright')

async function OlimpicaItems(producto) {
  const browser = await chromium.launch({
    headless: false
  })
  const page = await browser.newPage()

  await page.goto('https://www.olimpica.com')
  await page.waitForLoadState('domcontentloaded')
  await page.click('input[id^="downshift-"][id$="-input"]')
  await page.$eval('input[id^="downshift-"][id$="-input"]', (element, product) => {
    element.value = product
  }, producto)
  await page.keyboard.type(' ')
  await page.keyboard.press('Enter')
  await page.waitForTimeout(2000)
  await page.waitForSelector('div.vtex-search-result-3-x-galleryItem  ')

  const productElements = await page.$$('section.vtex-product-summary-2-x-container ')
  const phoneData = await Promise.all(productElements.slice(0, 5).map(async (product) => {

    const titleElement = await product.$('span.vtex-product-summary-2-x-productBrand');
    const title = titleElement ? await titleElement.innerText() : '';

    const priceElement = await product.$('span.olimpica-dinamic-flags-0-x-currencyContainer');
    const price = priceElement ? await priceElement.innerText() : '';

    const imgElement = await product.$('img.vtex-product-summary-2-x-imageNormal');
    const img = imgElement ? await imgElement.getAttribute('src') : '';

    const linkElement = await product.$('a');
    const link = linkElement ? await linkElement.getAttribute('href') : '';

    return {
      title: title,
      price: price,
      link:'https://www.olimpica.com'+link,
      img: img,
      market: 'Olimpica'
    };
  }))

  await browser.close()
  console.log(phoneData)
  const ProductsShow = validation(phoneData, producto)
  return ProductsShow
}

module.exports = {
  OlimpicaItems
}