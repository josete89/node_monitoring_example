import { Observable } from 'rxjs';
import request from 'request-promise-native'
import { Gauge } from 'prom-client'
const uuid = require('uuid-random')



export let httpCall = (url:string,gauge:Gauge):Observable<any> => {
    const obs = Observable.create((observer:any) => {
        var options = {
            headers:{
                'x-correlation-id':uuid()
            },
            json:true
        }
        console.log(JSON.stringify(options))
        gauge.inc()
        request(url,options).then((data)=>{
            observer.next(data)
            observer.complete()
        }).catch((err)=>{
            observer.error(err)
        })
    })
    return obs
}