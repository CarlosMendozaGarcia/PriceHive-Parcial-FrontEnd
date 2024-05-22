const {validation} = require('../functions/functions')

const {chromium} = require('playwright')

async function MercadoLibreItems(producto) {
    const browser = await chromium.launch()
    const page = await browser.newPage() 
  
    await page.goto('https://www.mercadolibre.com.co')
    await page.waitForLoadState('domcontentloaded')
    await page.click(".nav-search-input")
    await page.$eval('#cb1-edit', (element, product) => {
      element.value = product
    }, producto)
    await page.keyboard.type(' ')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(2000)
    await page.waitForSelector('.ui-search-layout__stack')

    const productElements = await page.$$('.andes-card.ui-search-result.ui-search-result--core.andes-card--flat.andes-card--padding-16')

    const phoneData = await Promise.all(productElements.slice(0,5).map(async (product) => {
      
      const titleElement = await product.$('.ui-search-item__group.ui-search-item__group--title');
      const title = titleElement ? await titleElement.innerText() : '';

      const priceElement = await product.$('.andes-money-amount__fraction');
      const price = priceElement ? await priceElement.innerText() : '';

      const imgElement = await product.$('.ui-search-result-image__element');
      const img = imgElement ? await imgElement.getAttribute('src') : '';

      const linkElement = await product.$('a.ui-search-item__group__element.ui-search-link__title-card.ui-search-link');
      const link = linkElement ? await linkElement.getAttribute('href') : '';

      return {
        title: title,
        price: price,
        link: link,
        img: img,
        market: 'MercadoLibre'
      };
    })) 

    await browser.close()
    const ProductsShow= validation(phoneData,producto)
    return ProductsShow
  }
  
  module.exports ={
    MercadoLibreItems
  }