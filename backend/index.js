import express from 'express'
import db from './db.js'

const app = express()

app.listen(process.env.PORT, async () => {
  try {
    await db.authenticate()
    console.log('Conexión a la base de datos establecida correctamente.')
    console.log(`API Online: http://localhost:${process.env.PORT}`)
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error)
  }
})