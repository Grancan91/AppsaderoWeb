import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import router from './api/router/indexRouter.js'
import db from './db.js'

const app = express()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true, // cookies/credenciales
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
app.use(express.json())
app.use(cookieParser())
app.use('/api', router)

app.listen(process.env.PORT, async () => {
  try {
    await db.authenticate()
    console.log('DB Online.')
    console.log(`API Online: http://localhost:${process.env.PORT}`)
  } catch (error) {
    console.error('DB Error:', error)
  }
})
