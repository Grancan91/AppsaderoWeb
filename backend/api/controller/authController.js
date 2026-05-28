import bcrypt from 'bcryptjs'
import User from '../model/user.js'

export const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body

    const existingUser = await User.findOne({ where: { email } })

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
    })

    return res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name,
    })
  } catch (err) {
    return res.status(500).json({ error: 'Server error', details: err.message })
  }
}
