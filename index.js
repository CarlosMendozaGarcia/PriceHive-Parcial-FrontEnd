const express = require('express')
const path = require('path')

const app = express()
const port = 3000

const { AlkostoItems,
    FalabellaItems,
    toHTML
} = require("./bot.js")


app.use(express.static(path.join(__dirname, 'assets')))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

let searchValue = []
app.get('/search', async (req, res) => {
    try {
        const searchValue = req.query.search;
        var html = ""
        var ProductsScrapp = []
        const productosAlkosto = await AlkostoItems(searchValue)
        //const productosFalabella = await FalabellaItems(searchValue)
        html += toHTML(productosAlkosto)
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
                        <input type="search" name="search" ide="search" placeholder="Producto que desea buscar" value=${searchValue}>
                        <button type="submit" >Buscar</button>
                    </form>
                </nav>
            </header>
            <section>
                <div class="banner">
                    <div class="productos">
                        <div class="filtro">
                            <div class="tipos">
                                <div class="precio">
                                    <p>Precio maximo</p>
                                    <input type="range" id="price" name="price" min="0" max="3000000">
                                </div>
                                <div class="mercado">
                                    <p> Mercado a seleccionar</p>
                                    <div>
                                        <input type="checkbox" name="mercado1" id="mercado1"><label for="mercado1">MercadoLibre</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" name="mercado2" id="mercado2"><label for="mercado2">Alkosto</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" name="mercado3" id="mercado3"><label for="mercado3">Olimpica</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" name="mercado4" id="mercado4"><label for="mercado4">Exito</label>
                                    </div>
                                    <div>
                                        <input type="checkbox" name="mercado5" id="mercado5"><label for="mercado5">Falabella</label>
                                    </div>
                                </div>
                            </div>
                            <input class="submit" type="submit" value="Aplicar filtros">
                        </div>
                        <div class="lista">
                        ${html}
                        </div>
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