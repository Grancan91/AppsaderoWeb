import bcrypt from 'bcrypt'
import User from '../models/User.js'

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body

    console.log(req.body)

    // 1. comprobar si existe
    const existingUser = await User.findOne({ where: { email } })

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // 2. hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 3. crear usuario
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    })

    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
    })
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message })
  }
}

export default { register }
