import { Observable } from 'rxjs';
import request from 'request-promise-native'
import { Counter } from 'prom-client'
import wrapRequest from 'zipkin-instrumentation-request'
import * as recoder from '../recorder/recorder'
const uuid = require('uuid-random')



export let httpCall = (url:string,serviceName:string,counter:Counter):Observable<any> => {
    const obs = Observable.create((observer:any) => {
        var options = {
            json:true
        }

        const tracer = recoder.zkTracer
        const remoteServiceName = serviceName
        const zipkinRequest = wrapRequest(request,{tracer});
        
        counter.inc()

        zipkinRequest(url,options).then((data)=>{
            observer.next(data)
            observer.complete()
        }).catch((err)=>{
            observer.error(err)
        })
    })
    return obs
}