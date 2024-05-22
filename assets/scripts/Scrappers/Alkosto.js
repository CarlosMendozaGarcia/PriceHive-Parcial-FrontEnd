const {validation} = require('../functions/functions')

const {chromium} = require('playwright')

async function AlkostoItems(producto) {
    const browser = await chromium.launch()
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

    await page.waitForSelector(`li.ais-InfiniteHits-item.product__item.js-product-item.js-algolia-product-click`)

    const productElements = await page.$$('li.ais-InfiniteHits-item.product__item.js-product-item.js-algolia-product-click')

    const phoneData= await Promise.all(productElements.slice(0,5).map(async (product) => {

      const titleElement = await product.$('h3.js-algolia-product-title');
      const title = titleElement ? await titleElement.innerText() : '';

      const priceElement = await product.$('span.price');
      const price = priceElement ? await priceElement.innerText() : '';

      const imgElement = await product.$(
        'div.product__item__information__image.js-algolia-product-click img'
      );
      const img = imgElement ? await imgElement.getAttribute('src') : '';

      const linkElement = await product.$('a.js-view-details.js-algolia-product-click');
      const link = linkElement ? await linkElement.getAttribute('href') : '';

      return {
        title: title,
        price: price,
        link: 'https://www.alkosto.com'+link,
        img: 'https://www.alkosto.com' + img,
        market: 'Alkosto'
      };
    }))
    
    await browser.close()
    // Estructurar los datos en un array de objetos
    const ProductsShow = validation(phoneData,producto)
    return ProductsShow
  }

  module.exports={
    AlkostoItems
  }