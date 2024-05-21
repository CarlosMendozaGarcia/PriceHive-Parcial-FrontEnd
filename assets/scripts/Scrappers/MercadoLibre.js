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
  
    // Extraer los productos
    const phoneData = await page.$$eval('.andes-card.ui-search-result.ui-search-result--core.andes-card--flat.andes-card--padding-16', products => {
      return products.slice(0, 5).map(product => {
        // Extraer el título
        const titleElement = product.querySelector('.ui-search-item__group.ui-search-item__group--title');
        const title = titleElement ? titleElement.innerText : '';
        const priceElement = product.querySelector('.andes-money-amount__fraction');
        const price = priceElement ? priceElement.innerText : '';
        const imgElement = product.querySelector('.ui-search-result-image__element')
        const img = imgElement ? imgElement.getAttribute('src') : '';
        const linkElement = product.querySelector('a.ui-search-item__group__element.ui-search-link__title-card.ui-search-link')
        const link = linkElement ? linkElement.href : '';
  
        return {
          title: String(title),
          price: String(price),
          link: link,
          img: img,
          market: 'Mercado Libre'
        };
      });
    });
    await browser.close()
    console.log(phoneData)
    const ProductsShow= validation(phoneData,producto)
    return ProductsShow
  }
  
  module.exports ={
    MercadoLibreItems
  }