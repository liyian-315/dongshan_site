import express from 'express'
import cors from 'cors'
import { mountDocsMulti } from './doc.js'

const app = express()
app.use(cors())  // 按需
mountDocsMulti(app)
app.listen(process.env.PORT || 3000, () => console.log('Server up'))
