import express from 'express'
import db from './db.js'

const app = express()

app.get('/', (req, res) => {
  res.send('API is working!')
})

const PORT = 3000

app.listen(PORT, async () => {
  try {
    // Intentamos conectar a la base de datos
    await db.authenticate()
    console.log('Conexión a la base de datos establecida correctamente.')
    console.log(`API online: http://localhost:${PORT}`)
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error)
  }
})