const {validation} = require('../functions/functions')

const {chromium} = require('playwright')


async function ExitoItems(producto) {
    const browser = await chromium.launch()
    const page = await browser.newPage() 
  
    await page.goto('https://www.exito.com')
    await page.waitForLoadState('domcontentloaded')
    await page.click(".search-input_fs-search-input__o0Mud")
    await page.$eval('[data-testid="store-input"]', (element, product) => {
      element.value = product
    }, producto)
    await page.keyboard.type(' ')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(2000)
    await page.waitForSelector('.product-card-no-alimentos_fsProductCardNoAlimentos__zw867')
  
    // Extraer los productos
    const phoneData = await page.$$eval('.product-card-no-alimentos_fsProductCardNoAlimentos__zw867', products => {
      return products.slice(0, 5).map(product => {
        // Extraer el título
        const titleElement = product.querySelector('a[data-testid="product-link"][title]');
        const title = titleElement ? titleElement.innerText : '';
        const priceElement = product.querySelector('.ProductPrice_container__JKbri');
        const price = priceElement ? priceElement.innerText : '';
        const imgElement = product.querySelector('.imagen_plp')
        const img = imgElement ? imgElement.getAttribute('src') : '';
        const linkElement = product.querySelector('a[data-testid="product-link"][title]')
        const link = linkElement ? linkElement.href : '';
        return {
          title: String(title),
          //specifications: specs,
          price: String(price),
          link: link,
          img: img,
          market: 'Exito'
        };
      });
    });
    await browser.close()
    console.log(phoneData)
    const ProductsShow= validation(phoneData,producto)
    return ProductsShow
  }
  
  module.exports= {
    ExitoItems
  }