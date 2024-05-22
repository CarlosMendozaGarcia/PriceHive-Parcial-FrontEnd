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

    const productElements = await page.$$('.product-card-no-alimentos_fsProductCardNoAlimentos__zw867')
    
    const phoneData= await Promise.all(productElements.slice(0,5).map(async (product) => {

      const titleElement = await product.$('a[data-testid="product-link"][title]');
      const title = titleElement ? await titleElement.innerText() : '';

      const priceElement = await product.$('.ProductPrice_container__JKbri');
      const price = priceElement ? await priceElement.innerText() : '';

      const imgElement = await product.$('.imagen_plp');
      const img = imgElement ? await imgElement.getAttribute('src') : '';

      const linkElement = await product.$('a[data-testid="product-link"][title]');
      const link = linkElement ? await linkElement.getAttribute('href') : '';

      return {
        title: title,
        price: price,
        link: 'https://www.exito.com'+link,
        img: img,
        market: 'Exito'
      };
    }))

    await browser.close()
    console.log(phoneData)
    const ProductsShow= validation(phoneData,producto)
    return ProductsShow
  }
  
  module.exports= {
    ExitoItems
  }