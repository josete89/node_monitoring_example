
const objects = require("../../resources/product.json")

export let retriveAll =  ():any => {
    return objects
}

export let filterById = (id:string):any => {
    let filtered =  objects.filter( (x:any) => x.id == id)
    let response = filtered.length == 1 ? filtered[0]:null
    return response
}

 