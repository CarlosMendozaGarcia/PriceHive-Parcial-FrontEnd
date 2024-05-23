const  { chromium } = require('playwright')

function validation(Product,producto){
  return Product.sort(function (item1, item2) {
    const a = item1.price.replace(/[.'$]/g, '')
    const b = item2.price.replace(/[.'$]/g, '')
    return a - b
  }).slice(0, 3).filter(function (item) {
    const a = item.title
    const b= String(producto).split(' ')
    var i = 0
    b.forEach(element => {
      if(a.toLowerCase().includes(element.toLowerCase()))
        {
          i++
        }
    });
    if(i >= b.length-1){
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
    html += "<p>"+product.market+"</p>"
    html += "</div>"
    html += "</a>";
    html += "</div>";
  })
  return html;
}

module.exports ={
  validation,
  toHTML
}

