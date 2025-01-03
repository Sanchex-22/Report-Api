/* eslint-disable camelcase */
import { User } from '../database/users_models.mjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config'
import { compare, encrypt } from '../utils/EncryptionUtil.mjs'
import { emailConfig } from '../email/email.mjs'
import { resetCodes } from '../utils/resetCodes.mjs'

export class authController {
  static async register (req, res) {
    // const transaction = await sequelize.transaction()
    try {
      const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/
      const rolesRaw = 'user'
      console.log(req.body)
      const {
        email_address,
        password
      } = req.body
      const username = email_address
      const roles = rolesRaw.toLowerCase()

      if (!['moderator', 'admin', 'user', 'super_admin'].includes(roles)) {
        return res.status(400).send({ message: 'Rol no permitido o puede ser nulo' })
      }

      const existingUser = await User.findOne({ attributes: ['id'], where: { username } })
      if (existingUser) {
        return res.status(400).send({ message: 'Ya existe un usuario con este nombre de usuario.' })
      }

      const existingUserEmail = await User.findOne({ attributes: ['id'], where: { email: email_address } })
      if (existingUserEmail) {
        return res.status(400).send({ message: 'Ya existe un usuario con este correo electrónico.' })
      }

      if (!passwordPattern.test(password)) {
        return res.status(400).send({ message: 'La contraseña debe contener al menos 8 caracteres, 1 letra mayúscula y 1 número.' })
      }

      if (!email_address.endsWith('@intermaritime.org')) {
        return res.status(400).send({ message: 'El correo electrónico debe tener una terminación en @intermaritime.org' })
      }
      // const activationToken = jwt.sign(
      //   { email: email_address, password, roles },
      //   process.env.SECRET_KEY,
      //   { expiresIn: '1h' }
      // )
      // const data = {
      //   activationLink: `${emailConfig.URL}/auth/activate-account/?token=${activationToken}`,
      //   email_address
      // }
      // MailInfo.verificationCode({ data })

      return res.status(200).send({ message: 'Por favor, revisa tu correo para activar tu cuenta.' })
    } catch (error) {
      // await transaction.rollback()
      console.error(error)
      return res.status(500).send({ message: 'Error en el servidor' })
    }
  }

  static async activateAccount (req, res) {
    const { token } = req.query
    console.log(token)
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY)
      const { email, password, roles } = decoded

      const user = await User.create({
        username: email,
        email,
        password: await encrypt(password),
        attempts: 0,
        blocked: false,
        roles,
        status: 'active'
      })
      if (!user) {
        return res.status(400).send({ message: 'No se pudo crear la cuenta.' })
      }
      // MailInfo.WelcomeMessage({ user })

      return res.status(200).send({ message: 'Cuenta activada exitosamente.' })
    } catch (error) {
      return res.status(400).send({ message: 'El enlace de activación ha expirado o es inválido.' })
    }
  }

  static async requestPasswordReset (req, res) {
    try {
      const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/
      const data = {
        email: req.body.email,
        password: req.body.password
      }
      if (!data.email.endsWith('@intermaritime.org')) {
        return res.status(400).send({ message: 'El correo electrónico debe tener una terminación en @intermaritime.org' })
      }
      if (!passwordPattern.test(data.password)) {
        return res.status(400).send({ message: 'La contraseña debe contener al menos 8 caracteres, 1 letra mayúscula y 1 número.' })
      }
      // await MailInfo.sendResetCode({ data })
      res.status(200).send({ message: 'Código de restablecimiento enviado al correo.' })
    } catch (error) {
      res.status(500).send({ message: 'Error al enviar el correo.' })
    }
  };

  static async resetPassword (req, res) {
    const { email, code, newPassword } = req.body
    console.log('data para editar', req.body)

    try {
      const storedCode = resetCodes[email]

      if (!storedCode || storedCode.code !== code || Date.now() > storedCode.expiry) {
        return res.status(400).send({ message: 'Código inválido o expirado.' })
      }

      const user = await User.findOne({ where: { email: req.body.email } })

      if (!user) {
        return res.status(400).send({ message: 'Usuario no encontrado.' })
      }

      const newPass = await encrypt(newPassword)
      if (Object.keys(newPass).length > 0) {
        await User.update({ password: newPass }, { where: { email: req.body.email } })
        delete resetCodes[email]
        return res.status(200).send({ message: 'Contraseña actualizada con éxito.' })
      } else {
        return res.status(400).send({ message: 'No hay cambios para actualizar.' })
      }
    } catch (error) {
      res.status(500).send({ message: 'Error al restablecer la contraseña.' })
    }
  };

  static async login (req, res) {
    try {
      const input = {
        email: req.body.email,
        password: req.body.password
      }

      const user = await User.findOne({ where: { email: input.email } })

      if (!user) { return res.status(404).send({ message: 'Usuario y contraseña incorrectos' }) }
      const passwordIsValid = await compare(input.password, user.password)
      console.log(input.email, input.password, passwordIsValid)

      if (!passwordIsValid) { return res.status(401).send({ message: 'Usuario y contraseña incorrectos' }) }

      const metaData = {
        id: user.id,
        username: user.username,
        roles: user?.roles ?? 'user',
        imageUrl: user?.img ?? ''
      }
      const token = jwt.sign({ metaData }, process.env.SECRET_KEY, { expiresIn: '30d' })

      return res.status(200).send({ metaData, token })
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
