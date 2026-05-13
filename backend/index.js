import express from 'express'
import router from './api/router/indexRouter.js'
import db from './db.js'

const app = express()
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
