const {validation} = require('../functions/functions')

const {chromium} = require('playwright')

async function FalabellaItems(producto) {
    const browser = await chromium.launch({
    })
    const page = await browser.newPage()
  
    await page.goto('https://falabella.com.co/falabella-co')
    await page.waitForLoadState('domcontentloaded')
    await page.click(".SearchBar-module_searchBar__Input__1kPKS")
    await page.$eval('.SearchBar-module_searchBar__Input__1kPKS', (element, product) => {
      element.value = product
    }, producto)
    await page.keyboard.type(' ')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(2000)
    await page.waitForSelector('div.jsx-1484439449')
  
    const phoneData = await page.$$eval('div.jsx-1484439449', products => {
      return products.slice(0, 5).map( product => {
        // Extraer el título
        const titleElement = product.querySelector(
          'b.pod-subTitle.subTitle-rebrand');
        const title = titleElement ? titleElement.innerText : '';

        const priceElement = product.querySelector(
          'span.copy10.primary.medium.jsx-3451706699.normal.line-height-22');
        const price = priceElement ? priceElement.innerText : '';

        const imgElement = product.querySelector('picture.jsx-1996933093 img')
        const img = imgElement ? imgElement.getAttribute('src') : '';

        const linkElement =  product.querySelector("a.pod-link");
        const link = linkElement ? linkElement.getAttribute("href"): '';

        return {
          title: title,
          price: price,
          link: link,
          img: img,
          market: 'Falabella'
        };
      });
    });
    await browser.close()
    console.log(phoneData)
    // Estructurar los datos en un array de objetos
    const ProductsShow = validation(phoneData,producto)
  
    return ProductsShow
  }

  module.exports = {
    FalabellaItems
  }