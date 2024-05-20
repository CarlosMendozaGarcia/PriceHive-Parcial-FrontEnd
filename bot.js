const  { chromium } = require('playwright')

function validation(Product,producto){
  return Product.sort(function (item1, item2) {
    const a = item1.price.replace(/[.'$]/g, '')
    const b = item2.price.replace(/[.'$]/g, '')
    return a - b
  }).slice(0, 3).filter(function (item) {
    const a = item.title
    const [modelo, ...elementos] = producto.split(' ').reverse()
    var i = 0
    if(a.toLowerCase().includes(modelo.toLowerCase()))
      {
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
  await page.waitForSelector('div.jsx-1484439449.search-results-4-grid.grid-pod')

  const phoneData = await page.$$eval('div.jsx-1484439449.search-results-4-grid.grid-pod', products => {
    return products.slice(0, 5).map(product => {
      // Extraer el título
      const titleElement = product.querySelector(
        '.jsx-2481219049.copy2.primary.jsx-3451706699.normal.line-clamp.line-clamp-3.pod-subTitle.subTitle-rebrand');
      const title = titleElement ? titleElement.innerText : '';
      const priceElement = product.querySelector(
        '.copy10.primary.medium.jsx-3451706699.normal.line-height-22');
      const price = priceElement ? priceElement.innerText : '';
      const imgElement = product.querySelector('picture.jsx-1996933093 img')
      const img = imgElement ? imgElement.getAttribute('src') : '';
      const linkElement = product.querySelector("a")
      console.log(linkElement)
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

}

async function MercadoLibreItems(producto) {

}

module.exports ={
  AlkostoItems,
  FalabellaItems,
  OlimpicaItems,
  ExitoItems,
  MercadoLibreItems,
  toHTML
}

