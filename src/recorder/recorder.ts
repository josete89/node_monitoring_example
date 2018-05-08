
import CLSContext from 'zipkin-context-cls'
import { HttpLogger } from 'zipkin-transport-http'
import { Tracer,BatchRecorder,jsonEncoder } from 'zipkin'
import { Express } from "express";
import zipkinMiddleware from 'zipkin-instrumentation-express'

const ctxImpl = new CLSContext('zipkin');
const localServiceName = 'product-backend';

const zipkinBaseUrl = process.env.ZIPKIN_URL;
  
const recorder = new BatchRecorder({
logger: new HttpLogger({
    endpoint: `${zipkinBaseUrl}/api/v2/spans`,
    jsonEncoder: jsonEncoder.JSON_V2
})
});
const tracer = new Tracer({ctxImpl, recorder, localServiceName});

export let setupTracer = (app:Express) => {
    let middleware = zipkinMiddleware.expressMiddleware
    app.use(middleware({tracer}));
}

export let zkTracer = tracer
