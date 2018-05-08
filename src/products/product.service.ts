
import { Observable,of,combineLatest,forkJoin } from 'rxjs'
import * as network from '../datasources/network'
import * as prom from '../metrics/metrics'

const objects = require("../../resources/product.json")

let getImageGauge = new prom.Counter({ name: 'Image', help: 'Get an image from a product' })
let getInventoryGauge = new prom.Counter({ name: 'Inventory', help: 'Get the inventory from a product' })

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
    const imagesURL = process.env.IMAGES_SERVICE
    const inventoryURL = process.env.INVENTORY_SERVICE

    const images = network.httpCall(`${imagesURL}/products/${product.id}/images`,'images-service',getImageGauge)
    const inventory = network.httpCall(`${inventoryURL}/inventory/${product.id}`,'inventory-service',getInventoryGauge)
    
    const combined = combineLatest([images,inventory],(img:any,inv:any)=>{ 
        product.images = img
        product.inventory = inv
        return product
    })
    return combined
}

 