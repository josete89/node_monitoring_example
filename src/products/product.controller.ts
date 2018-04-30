
import * as service from './product.service'
import { Request, Response } from "express";

export let  getProducts = (req: Request, res: Response) => {
    let objects = service.retriveAll()
    res.send(objects).status(200)
}

export let getProductsById = (req: Request, res: Response) => {
    let id = req.params.id
    let object = service.filterById(id)
    if (object){
        res.status(200).send(object)
    }
    res.status(404).send()
}

