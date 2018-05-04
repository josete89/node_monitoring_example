
import * as service from './product.service'
import { Request, Response } from "express";
import * as prom from '../metrics/metrics'

let getProductsGauge = new prom.Gauge({ name: 'Products', help: 'Get all products' })
let getProductByIdGauge = new prom.Gauge({ name: 'ProductById', help: 'Get a product by id' })

export let  getProducts = (req: Request, res: Response) => {
    let objects = service.retriveAll()
    objects.subscribe( x => {
        getProductsGauge.inc()
        res.send(x).status(200)
    })
    
}

export let getProductsById = (req: Request, res: Response) => {
    let id = req.params.id
    let object = service.filterById(id)
    object.subscribe( x => {
        getProductByIdGauge.inc()
        if (x){
            res.status(200).send(x)
        }
        res.status(404).send()
    })
    
}

