import { user } from '../database/usersModels.mjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

export class authController {
  static async login (req, res) {
    try {
      const input = {
        email: req.body.email,
        password: req.body.password
      }

      const u = await user.findOne({ where: { email: input.email } })

      if (!u) {
        return res.status(404).send({ message: 'Usuario no encontrado' })
      }

      const userDataResponse = await fetch(`https://api.clerk.com/v1/users/${u.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CLERK_TOKEN}`
        }
      })

      if (!userDataResponse.ok) {
        return res.status(500).send({ message: 'Error al obtener la data del usuario' })
      }

      const userData = await userDataResponse.json()
      console.log('Data del usuario:', userData.email_addresses[0].email_address)
      console.log('Data del usuario:', userData)

      const verifyPasswordResponse = await fetch(`https://api.clerk.com/v1/users/${u.id}/verify_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.CLERK_TOKEN}`
        },
        body: JSON.stringify({ password: input.password })
      })

      if (!verifyPasswordResponse.ok) {
        return res.status(500).send({ message: 'Contraseña Incorrecta' })
      }

      const verifyPasswordData = await verifyPasswordResponse.json()
      console.log('Verificación de contraseña:', verifyPasswordData)

      const userToken = {
        id: userData.id,
        username: userData.username,
        roles: userData?.public_metadata?.roles ?? 'user'
      }
      const token = jwt.sign({ userToken }, process.env.SECRET_KEY, { expiresIn: '1d' })

      return res.status(200).send({ userToken, token })
    } catch (error) {
      console.error('Error:', error)
      return res.status(500).send({ message: 'Error interno del servidor', error })
    }
  }

  static async logout (req, res) {
    try {
      return res.status(200).send({
        message: 'You ve been signed out!'
      })
    } catch (err) {
      this.next(err)
    }
  }
}
