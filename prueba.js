const {validation} = require('./assets/scripts/functions/functions.js')
const {chromium} = require('playwright')

async function MercadoLibreItems(producto) {
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

      // Extraer las especificaciones
      /* const keys = Array.from(product.querySelectorAll('.item--key')).map(key => key.innerText);
      const values = Array.from(product.querySelectorAll('.item--value')).map(value => value.innerText);
      let specs = {};
      keys.forEach((key, index) => {
        specs[key] = values[index];
      }); */

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
  console.log(ProductsShow)
  return ProductsShow

}

async function AlkostoItems(producto) {
  const browser = await chromium.launch(
    {
      headless:false
    }
  )
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
      link: link,
      img: 'https://www.alkosto.com' + img,
      market: 'Alkosto'
    };
  }))
  
  await browser.close()
  console.log(phoneData)
  // Estructurar los datos en un array de objetos
  const ProductsShow = validation(phoneData,producto)
  console.log(ProductsShow)
  return ProductsShow
}

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
      link: link,
      img: img,
      market: 'Olimpica'
    };
  }))

  await browser.close()
  console.log(phoneData)
  const ProductsShow = validation(phoneData, producto)
  return ProductsShow
}

OlimpicaItems('Samsung S20')