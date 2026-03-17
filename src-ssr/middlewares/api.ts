import { ssrMiddleware } from 'quasar/wrappers'
import routes from '../../src/api/routes'
import type { Request, Response } from 'express'
import { parse } from 'url'

export default ssrMiddleware(({ app, resolve }) => {
    app.all(resolve.urlPath('*'), async (req: Request, res: Response, next) => {
        const { pathname } = parse(req.url)
        if (!pathname || !pathname.startsWith('/api')) {
            return next()
        }

        const path = pathname.replace(/^\/api/, '')

        if (!Object.keys(routes).includes(path)) {
            res.sendStatus(404).end()
            return
        }

        // if(req.url === '/api/test') {
        //   res.sendStatus(401).end()
        //   return
        // }

        console.log(`API hit on ${path}`)
        console.log(`Resquest ${req.url}`)

        try {
            const handler = (await routes[path as keyof typeof routes]())
                .default
            handler(req, res)
        } catch (error) {
            console.error(error)
            res.sendStatus(500).end()
        }
    })
})
