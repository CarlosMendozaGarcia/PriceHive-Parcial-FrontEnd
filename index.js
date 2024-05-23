const express = require('express')
const path = require('path')

const app = express()
const port = 3000

const { AlkostoItems } = require('./assets/scripts/Scrappers/Alkosto')
const { ExitoItems } = require('./assets/scripts/Scrappers/Exito')
const { FalabellaItems } = require('./assets/scripts/Scrappers/Falabella')
const { MercadoLibreItems } = require('./assets/scripts/Scrappers/MercadoLibre')
const { OlimpicaItems } = require('./assets/scripts/Scrappers/Olimpica')

const { toHTML } = require('./assets/scripts/functions/functions')


app.use(express.static(path.join(__dirname, 'assets')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

const searchResults = {};

app.get('/search', async (req, res) => {
    try {
        const searchValue = req.query.search

        let sortByPrice = req.query.price === 'on';
        let selectedMarkets = [];
        if (req.query.mercado1 === 'on') selectedMarkets.push('MercadoLibre');
        if (req.query.mercado2 === 'on') selectedMarkets.push('Alkosto');
        if (req.query.mercado3 === 'on') selectedMarkets.push('Olimpica');
        if (req.query.mercado4 === 'on') selectedMarkets.push('Exito');
        if (req.query.mercado5 === 'on') selectedMarkets.push('Falabella');

        const page = req.query.page || 1
        const itemsPage = 5
        const start = (page - 1) * itemsPage;
        const end = start + itemsPage;

        if (!searchResults[searchValue]) {
            var ProductsScrap = await Promise.all([
                AlkostoItems(searchValue),
                FalabellaItems(searchValue),
                MercadoLibreItems(searchValue),
                ExitoItems(searchValue),
                OlimpicaItems(searchValue)
            ])

            const FirstProductsCard = []

            ProductsScrap.map(element => {
                element.map(item => {
                    return FirstProductsCard.push(item)
                })
            })

            searchResults[searchValue] = FirstProductsCard
        }

        let ProductsCard = searchResults[searchValue]

        if (selectedMarkets.length > 0) {
            ProductsCard = ProductsCard.filter(product => selectedMarkets.includes(product.market));
        }

        if (sortByPrice) {
            ProductsCard.sort((item1, item2) => {
                const a = item1.price.replace(/[.'$]/g, '')
                const b = item2.price.replace(/[.'$]/g, '')
                return a - b
            });
        }

        const totalPages = Math.ceil(ProductsCard.length / itemsPage);

        html = toHTML(ProductsCard.slice(start, end))

        let pages = '';
        for (let i = 1; i <= totalPages; i++) {
            pages += `<a href="/search?search=${searchValue}&page=${i}&price=${sortByPrice}&mercado1=${req.query.mercado1}&mercado2=${req.query.mercado2}&mercado3=${req.query.mercado3}&mercado4=${req.query.mercado4}&mercado5=${req.query.mercado5}">${i}</a>`;
        }

        res.send(`<!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PriceHive</title>
        <link rel="stylesheet" href="./css/style.css">
        <link rel="shortcut icon" href="./img/logo.png">
    </head>
    
    <body>
        <main>
            <header>
                <nav>
                    <div class="name">
                        <img src="./img/logo.png" alt="logo">
                        <h1>PriceHive</h1>
                    </div>
                    <form action ="/search" method="GET" class="busqueda">
                        <input type="search" name="search" id="search" placeholder="Producto que desea buscar" value=${searchValue}>
                        <button type="submit" >Buscar</button>
                    </form>
                </nav>
            </header>
            <section>
                <div class="banner">
                    <div class="productos">
                        <div class="filtro">
                            <form action="/search">
                                <input type="hidden" name="search" value="${searchValue}">
                                <div class="tipos">
                                    <div class="precio">
                                        <input type="checkbox" id="price" name="price" ${sortByPrice ? 'checked' : ''} > <label for="price">Precio</label>
                                    </div>
                                    <div class="mercado">
                                        <p> Mercado a seleccionar</p>
                                            <div>
                                                <input type="checkbox" name="mercado1" id="mercado1" ${req.query.mercado1 === 'on' ? 'checked' : ''}><label for="mercado1">MercadoLibre</label>
                                            </div>
                                            <div>
                                                <input type="checkbox" name="mercado2" id="mercado2" ${req.query.mercado2 === 'on' ? 'checked' : ''}><label for="mercado2">Alkosto</label>
                                            </div>
                                            <div>
                                                <input type="checkbox" name="mercado3" id="mercado3" ${req.query.mercado3 === 'on' ? 'checked' : ''}><label for="mercado3">Olimpica</label>
                                            </div>
                                            <div>
                                                <input type="checkbox" name="mercado4" id="mercado4" ${req.query.mercado4 === 'on' ? 'checked' : ''}><label for="mercado4">Exito</label>
                                            </div>
                                            <div>
                                                <input type="checkbox" name="mercado5" id="mercado5" ${req.query.mercado5 === 'on' ? 'checked' : ''}><label for="mercado5">Falabella</label>
                                            </div>
                                    </div>
                                </div>
                                <input class="submit" type="submit" value="Aplicar filtros">
                            </form>
                        </div>
                        <div class="lista">
                        ${html}
                        </div>
                        <div class="pagination">${pages}</div>
                    </div>
                </div>
    
            </section>
            <footer>
                <p> Copyright <span>&copy;</span> 2024 PriceHive Co.,Ltd. All Rights Reserved. </p>
                <p> Web designed by <span class="special">Carlos Mendoza, Augusto de Avila</span></p>
            </footer>
        </main>
        <script type="module" src="./index.js"></script>
    </body>
    </html>`)
    } catch (error) {
        res.status(500).send({ msg: "Error ocurred while scraping", error: error.message })
    }
})

app.listen(port, () => {
    console.log(`Server corriendo en http://localhost:${port}`)
})