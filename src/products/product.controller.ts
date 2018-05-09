
import * as service from './product.service'
import { Request, Response } from "express";
import * as prom from '../metrics/metrics'

let getProductsCounter = new prom.Counter({ name: 'total_requests_all_products', help: 'Get all products' })
let getProductByIdCounter = new prom.Counter({ name: 'total_requests_product_by_id', help: 'Get a product by id' })

let errorHandling = (res:Response) => (err:any) => {
    res.send(err).status(500)
}

export let  getProducts = (req: Request, res: Response) => {
    let objects = service.retriveAll()
    let handleError = errorHandling(res)
    getProductsCounter.inc()
    objects.subscribe( x => {
        res.send(x).status(200)
    },handleError)
    
}

export let getProductsById = (req: Request, res: Response) => {
    let id = req.params.id
    let object = service.filterById(id)
    let handleError = errorHandling(res)
    getProductByIdCounter.inc()
    object.subscribe( x => {
        if (x){
            res.status(200).send(x)
        }
        res.status(404).send()
    },handleError)
    
}

