import express from 'express'
import bodyParser from "body-parser";

import * as products from "./products/product.controller"

//Tracer stuff
import * as recorder from "./recorder/recorder"
import * as metrics from "./metrics/metrics"

const app = express()

//Headers : x-correlation-id

recorder.setupTracer(app)
app.set("port",process.env.PORT || 3000)
app.use(bodyParser.json());

app.get('/products',products.getProducts)
app.get('/products/:id',products.getProductsById)

app.get('/metrics',metrics.route)


export default app 