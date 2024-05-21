const  { chromium } = require('playwright')

function validation(Product,producto){
  return Product.sort(function (item1, item2) {
    const a = item1.price.replace(/[.'$]/g, '')
    const b = item2.price.replace(/[.'$]/g, '')
    return a - b
  }).slice(0, 3).filter(function (item) {
    const a = item.title
    const b= producto.split(' ')
    var i = 0
    b.forEach(element => {
      if(a.toLowerCase().includes(element.toLowerCase()))
        {
          i++
        }
    });
    if(i===b.length){
      return item
    }    
  })
}

function toHTML(Product) {
  var html = ""
  const htmlProduct = Product.map(product => {
    html += "<div class=pricecard>"
    html += "<a href="+product.link+">"
    html += "<img src= " + product.img + "></img>";
    html += "<div class=infocard>"
    html += "<h4>" + product.title + "</h4>";
    html += "<p>" + product.price + "</p>";
    html += "</div>"
    html += "</a>";
    html += "</div>";
  })
  return html;
}

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
  await page.waitForSelector(`.js-algolia-product-click`)

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
        
        // Extraer las especificaciones
        /* const keys = Array.from(product.querySelectorAll('.item--key')).map(key => key.innerText);
        const values = Array.from(product.querySelectorAll('.item--value')).map(value => value.innerText);
        let specs = {};
        keys.forEach((key, index) => {
          specs[key] = values[index];
        }); */

        return {
          title: title,
          img: 'https://www.alkosto.com' + img,
          /* specifications: specs, */
          price: price,
          link: link,
          market: 'Alkosto'
        };
      });
    });
  await browser.close()

  // Estructurar los datos en un array de objetos
  const ProductsShow = validation(phoneData,producto)

  return ProductsShow
}


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
  await page.waitForSelector('div.jsx-1484439449')

  const phoneData = await page.$$eval('div.jsx-1484439449', products => {
    return products.slice(0, 5).map(product => {
      // Extraer el título
      const titleElement = product.querySelector(
        'b.pod-subTitle.subTitle-rebrand');
      const title = titleElement ? titleElement.innerText : '';
      const priceElement = product.querySelector(
        'span.copy10.primary.medium.jsx-3451706699.normal.line-height-22');
      const price = priceElement ? priceElement.innerText : '';
      const imgElement = product.querySelector('picture.jsx-1996933093 img')
      const img = imgElement ? imgElement.getAttribute('src') : '';
      const linkElement = product.querySelector("a")
      const link = linkElement ? linkElement.href : '';

      /* await page.click(product)
      const keys = Array.from(page.querySelectorAll('li.jsx-2794857728')).map(key => key.innerText);
      const values = Array.from(page.querySelectorAll('strong.jsx-2794857728')).map(value => value.innerText);
      let specs = {};
      keys.forEach((key, index) => {
        specs[key] = values[index];
      }); */

      return {
        title: title,
        img: img,
        price: price,
        link: link,
        market: 'Falabella'
      };
    });
  });
  await browser.close()
  
  // Estructurar los datos en un array de objetos
  const ProductsShow = validation(phoneData,producto)

  return ProductsShow
}

async function OlimpicaItems(producto) {
  
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
  const ProductsShow= validation(phoneData,producto)
  return ProductsShow
}

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
        market: 'Mercado Libre'
      };
    });
  });
  await browser.close()
  const ProductsShow= validation(phoneData,producto)
  return ProductsShow
}

module.exports ={
  AlkostoItems,
  FalabellaItems,
  OlimpicaItems,
  ExitoItems,
  MercadoLibreItems,
  validation,
  toHTML
}

