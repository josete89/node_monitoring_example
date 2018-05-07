
import { Observable,of,combineLatest,forkJoin } from 'rxjs'
import * as network from '../datasources/network'
import * as prom from '../metrics/metrics'

const objects = require("../../resources/product.json")

let getImageGauge = new prom.Gauge({ name: 'Image', help: 'Get an image from a product' })
let getInventoryGauge = new prom.Gauge({ name: 'Inventorty', help: 'Get the inventory from a product' })

export let retriveAll =  ():Observable<any> => {
    let obs = objects.map( fetchAdditionaInfo )
    let result = forkJoin(obs)
    return result
}

export let filterById = (id:string):Observable<any> => {
    let filtered =  objects.filter( (x:any) => x.id == id)
    let product = filtered.length == 1 ? filtered[0]:null
    if (product){
        let result = fetchAdditionaInfo(product)
        return result
    }
    return of(null)
}

let fetchAdditionaInfo = (product:any):Observable<any> => {
    const imagesURL = process.env.IMAGES_SERVICE || "https://httpbin.org/ip"
    const inventoryURL = process.env.INVENTORY_SERVICE || "https://httpbin.or/ip"
    const images = network.httpCall(imagesURL,getImageGauge)
    const inventory = network.httpCall(inventoryURL,getInventoryGauge)
    
    const combined = combineLatest([images,inventory],(img:any,inv:any)=>{ 
        product.images = img
        product.inventory = inv
        return product
    })
    return combined
}

 