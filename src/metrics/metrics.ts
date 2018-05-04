import prom from 'prom-client'
import { Request, Response } from "express";

const collectDefaultMetrics = prom.collectDefaultMetrics
collectDefaultMetrics({timeout:5000})

export let route = (req: Request, res: Response) => {
    res.set('Content-Type', prom.register.contentType).send(prom.register.metrics())
}

export let Gauge = prom.Gauge
