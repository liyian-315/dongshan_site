import express from 'express'
import { readdirSync, statSync } from 'fs'
import { join, resolve } from 'path'

export function mountDocsMulti(app) {
    const MAP = {
        open_source: resolve(process.env.DOCS_DIR_GUIDES || '/opt/dongshan/markdowns/open_source'),
        dongshanpai:    resolve(process.env.DOCS_DIR_FAQ    || '/opt/dongshan/markdowns/dongshanpai'),
    }

    for (const [key, root] of Object.entries(MAP)) {
        const base = `/docs/${key}`

        app.use(base, express.static(root, {
            etag:true, lastModified:true, cacheControl:true, maxAge:'1h'
        }))

        app.get(`${base}/index.json`, (_req, res) => {
            res.set('Cache-Control','no-store')
            res.json(walk(root).map(rel => rel.replace(/\\/g,'/')))
        })

        console.log(`[docs] mount ${base} -> ${root}`)
    }

    function walk(root, prefix='') {
        const out = []
        for (const name of readdirSync(join(root, prefix))) {
            const abs = join(root, prefix, name)
            const st = statSync(abs)
            if (st.isDirectory()) out.push(...walk(root, join(prefix, name)))
            else if (/\.md$/i.test(name)) out.push(join(prefix, name))
        }
        return out
    }
}
