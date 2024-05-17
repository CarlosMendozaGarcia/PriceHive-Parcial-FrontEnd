import { chromium } from 'playwright'

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
    await page.waitForSelector(`.js-algolia-product-click`)

    // Extraer los productos
    const phoneData = await page.$$eval('.ais-InfiniteHits-item.product__item.js-product-item.js-algolia-product-click', products => {
        return products.slice(0,5).map(product => {
          // Extraer el título
          const titleElement = product.querySelector('.js-algolia-product-title');
          const title = titleElement ? titleElement.innerText : '';
          const priceElement = product.querySelector('.price');
          const price = priceElement ? priceElement.innerText : '';

          // Extraer las especificaciones
          const keys = Array.from(product.querySelectorAll('.item--key')).map(key => key.innerText);
          const values = Array.from(product.querySelectorAll('.item--value')).map(value => value.innerText);
          let specs = {};
          keys.forEach((key, index) => {
            specs[key] = values[index];
          });
    
          return {
            title: title,
            specifications: specs,
            price: price
          };
        });
      });

    // Estructurar los datos en un array de objetos
    const ProductsShow = phoneData.sort(function (item1, item2){
        const a= item1.price.replace(/[.'$]/g,'')
        const b= item2.price.replace(/[.'$]/g,'') 
        return a-b
    }).slice(0,3).filter(function (item){
        return item.title.includes(producto)
    })
    console.log(ProductsShow)
    await browser.close()
}


async function FallabellaItems(producto) {
    const browser = await chromium.launch({
        headless: false,
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
    await page.waitForSelector('.jsx-1484439449.search-results-4-grid.grid-pod')

    const phoneData = await page.$$eval('.jsx-1484439449.search-results-4-grid.grid-pod', products => {
        return products.slice(0,5).map(async product => {
          // Extraer el título
          const titleElement = product.querySelector('.jsx-2481219049.copy2.primary.jsx-3451706699.normal.line-clamp.line-clamp-3.pod-subTitle.subTitle-rebrand');
          const title = titleElement ? titleElement.innerText : '';
          const priceElement = product.querySelector('.copy10.primary.medium.jsx-3451706699.normal.line-height-22');
          const price = priceElement ? priceElement.innerText : '';
    
          return {
            title: title,
            /* specifications: specs, */
            price: price
          };
        });
      });
    console.log(phoneData)
    // Estructurar los datos en un array de objetos
    const ProductsShow = phoneData.sort(function (item1, item2){
        const a= item1.price.replace(/[.'$]/g,'')
        const b= item2.price.replace(/[.'$]/g,'') 
        return a-b
    }).slice(0,3).filter(function (item){
        return item.title.includes(producto)
    })
    console.log(ProductsShow)
    await browser.close()
}

/* AlkostoItems('Samsung Galaxy A54') */
FallabellaItems('Samsung Galaxy A54')

