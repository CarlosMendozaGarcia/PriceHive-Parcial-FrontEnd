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
    console.log('antes de selector')
    await page.waitForSelector(`li.ais-InfiniteHits-item.product__item.js-product-item.js-algolia-product-click`)
  
    // Extraer los productos
    const phoneData = await page.$$eval(
      'li.ais-InfiniteHits-item.product__item.js-product-item.js-algolia-product-click', products => {
        return products.slice(0, 5).map(product => {
          // Extraer el título
          const titleElement = product.querySelector('h3.js-algolia-product-title');
          const title = titleElement ? titleElement.innerText : '';
          const priceElement = product.querySelector('span.price');
          const price = priceElement ? priceElement.innerText : '';
          const imgElement = product.querySelector(
            'div.product__item__information__image.js-algolia-product-click img')
          const img = imgElement ? imgElement.getAttribute('src') : '';
          const linkElement = product.querySelector(
            'a.js-view-details.js-algolia-product-click')
          const link = linkElement ? linkElement.href : '';
  
          return {
            title: title,
            price: price,
            link: link,
            img: 'https://www.alkosto.com' + img,
            market: 'Alkosto'
          };
        });
      });
    await browser.close()
    console.log(phoneData)
    // Estructurar los datos en un array de objetos
    const ProductsShow = validation(phoneData,producto)
    console.log(ProductsShow)
    return ProductsShow
  }

  module.exports={
    AlkostoItems
  }