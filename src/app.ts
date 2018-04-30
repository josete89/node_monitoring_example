import express from 'express'
import bodyParser from "body-parser";

import * as products from "./products/product.controller"

//Tracer stuff
import * as recorder from "./recorder/recorder"

const app = express()


recorder.setupTracer(app)
app.set("port",process.env.PORT || 3000)
app.use(bodyParser.json());

app.get('/products',products.getProducts)
app.get('/products/:id',products.getProductsById)

export default app 