import { Observable } from 'rxjs';
import request from 'request-promise-native'
import { Gauge } from 'prom-client'

var options = {
    headers:{
        'x-correlation-id':'1'
    }
}

export let httpCall = (url:string,gauge:Gauge):Observable<any> => {
    const obs = Observable.create((observer:any) => {
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