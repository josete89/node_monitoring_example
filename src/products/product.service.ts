
import { Observable,of,combineLatest,forkJoin } from 'rxjs'
import * as network from '../datasources/network'
import * as prom from '../metrics/metrics'

const objects = require("../../resources/product.json")

let getImageCounter= new prom.Counter({ name: 'requests_to_img_svc', help: 'Get an image from a product' })
let getInventoryCounter= new prom.Counter({ name: 'requests_to_inventory', help: 'Get the inventory from a product' })

export let retriveAll =  ():Observable<any> => {
    let obs = objects.map( fetchAdditionaInfo )
    let result = forkJoin(obs)
    return result
}

export let filterById = (id:string):Observable<any> => {
    let filtered =  objects.filter( (x:any) => x.articleNumber == id)
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
    const id = product.articleNumber
    const images = network.httpCall(`${imagesURL}/products/${id}/images`,'images-service',getImageCounter)
    const inventory = network.httpCall(`${inventoryURL}/inventory/${id}`,'inventory-service',getInventoryCounter)
    
    const combined = combineLatest([images,inventory],(img:any,inv:any)=>{ 
        product.images = img
        product.inventory = inv
        return product
    })
    return combined
}

 