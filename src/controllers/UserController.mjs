/* eslint-disable camelcase */
import { encrypt } from '../../src/utils/EncryptionUtil.mjs'
import { User } from '../database/users_models.mjs'
// import { MailInfo } from './SendMailController.mjs'
import { Op } from 'sequelize'
import sequelize from '../database/database_conn.mjs'

export class userController {
  static async newUser (req, res) {
    const transaction = await sequelize.transaction()
    try {
      const attempts = 0
      const blocked = false
      const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/

      console.log(req.body)
      const {
        email_address,
        username,
        password,
        rolesRaw,
        status
      } = req.body

      const roles = rolesRaw.toLowerCase()

      const pass = await encrypt(password)
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

      if (!email_address.endsWith('@gmail.com') && !email_address.endsWith('@intermaritime.org')) {
        return res.status(400).send({ message: 'El correo electrónico debe tener una terminación en "@gmail.com" o "@intermaritime.org".' })
      }

      const u = await User.create({
        username,
        email: email_address,
        password: pass,
        attempts,
        blocked,
        roles,
        status
      }, { transaction })

      console.log('Creando usuario: ' + u)

      if (!u) {
        await transaction.rollback()
        return res.status(400).send({ message: 'La creación del usuario falló.' })
      }
      await transaction.commit()
      // const info = MailInfo.WelcomeMessage({ u })

      return res.status(200).send({ message: 'Usuario creado con éxito.' + u })
    } catch (error) {
      await transaction.rollback()
      console.error(error)
      return res.status(500).send({ message: 'Error en el servidor' })
    }
  }

  static async editUser (req, res) {
    try {
      const { uid = '', username = '', email = '', password = '', attempts, roles = '', status = '' } = req.body
      const passwordPattern = /^(?=.*[A-Z])(?=.*\d).{8,}$/
      const rol = roles ? roles.toLowerCase() : ''
      console.log(req.body)

      if (!uid) {
        return res.status(400).send({ message: 'El ID del usuario es requerido.' })
      }

      if (roles && !['moderator', 'admin', 'user', 'super_admin'].includes(rol)) {
        return res.status(400).send({ message: 'Rol no permitido o puede ser nulo' })
      }

      const user = await User.findOne({ where: { id: uid } })
      if (!user) {
        return res.status(404).send({ message: 'Usuario no encontrado.' })
      }

      if (username && username !== user.username) {
        const existingUser = await User.findOne({ attributes: ['id'], where: { username } })
        if (existingUser) {
          return res.status(400).send({ message: 'Ya existe un usuario con este nombre de usuario.' })
        }
      }

      if (email && email !== user.email) {
        const existingUserEmail = await User.findOne({ attributes: ['id'], where: { email } })
        if (existingUserEmail) {
          return res.status(400).send({ message: 'Ya existe un usuario con este correo electrónico.' })
        }

        if (!email.endsWith('@gmail.com') && !email.endsWith('@intermaritime.org')) {
          return res.status(400).send({ message: 'El correo electrónico debe tener una terminación en "@gmail.com" o "@intermaritime.org".' })
        }
      }

      if (password && !passwordPattern.test(password)) {
        return res.status(400).send({ message: 'La contraseña debe contener al menos 8 caracteres, 1 letra mayúscula y 1 número.' })
      }

      const updatedData = {}
      if (username && username !== user.username) updatedData.username = username
      if (email && email !== user.email) updatedData.email = email
      if (password) updatedData.password = await encrypt(password)
      if (attempts !== undefined) updatedData.attempts = attempts
      if (roles && rol !== user.roles) updatedData.roles = rol
      if (status && status !== user.status) updatedData.status = status

      if (Object.keys(updatedData).length > 0) {
        await User.update(updatedData, { where: { id: uid } })
        return res.status(200).send({ message: 'El usuario ha sido editado.' })
      } else {
        return res.status(400).send({ message: 'No hay cambios para actualizar.' })
      }
    } catch (e) {
      console.error(e)
      return res.status(500).send({ message: 'Error en el servidor.' })
    }
  }

  static async editUserAvatar (req, res) {
    try {
      const { uid = '', img = '' } = req.body
      console.log(req.body)

      if (!uid) {
        return res.status(400).send({ message: 'El ID del usuario es requerido.' })
      }
      const user = await User.findOne({ where: { id: uid } })
      if (!user) {
        return res.status(404).send({ message: 'Usuario no encontrado.' })
      }
      const updatedData = {}
      if (img && img !== user.img) updatedData.img = img

      if (Object.keys(updatedData).length > 0) {
        await User.update(updatedData, { where: { id: uid } })
        return res.status(200).send({ message: 'El avatar ha sido editado.' })
      } else {
        return res.status(400).send({ message: 'No hay cambios para actualizar.' })
      }
    } catch (e) {
      console.error(e)
      return res.status(500).send({ message: 'Error en el servidor.' })
    }
  }

  static async deleteUser (req, res) {
    const transaction = await sequelize.transaction()
    try {
      const uid = req.body.id

      const u = await User.findOne({ where: { id: uid } })
      if (!u) { return res.status(404).send({ message: 'el usuario no existe' }) }

      await User.destroy({ where: { id: u.id } }, { transaction })
      await transaction.commit()
    } catch (e) {
      await transaction.rollback()
      return res.status(500).send({ message: 'error en el servidor' })
    }
  }

  static async getUser (req, res) {
    try {
      const uid = req.params.id

      const u = await User.findOne({ where: { id: uid } })
      if (!u) { return res.status(404).send({ message: 'el usuario no existe' }) }
      return res.status(200).send(u)
    } catch (e) {
      return res.status(500).send({ message: 'error en el servidor' })
    }
  }

  static async getProfile (req, res) {
    try {
      const uid = req.params.id

      const u = await User.findOne({ where: { id: uid } })
      if (!u) { return res.status(404).send({ message: 'el usuario no existe' }) }
      return res.status(200).send(u)
    } catch (e) {
      return res.status(500).send({ message: 'error en el servidor' })
    }
  }

  static async getAllUser (req, res) {
    try {
      const u = await User.findAll()
      if (!u) { return res.status(404).send({ message: 'no hay usuarios' }) }
      return res.status(200).send(u)
    } catch (e) {
      return res.status(500).send({ message: 'error en el servidor' })
    }
  }

  static async getAllUserAdmin (req, res) {
    try {
      const u = await User.findAll({
        attributes: ['id', 'email'],
        where: {
          roles: {
            [Op.or]: ['admin', 'super_admin']
          }
        }
      })
      if (!u) { return res.status(404).send({ message: 'no hay usuarios' }) }
      return res.status(200).send(u)
    } catch (e) {
      return res.status(500).send({ message: 'error en el servidor' })
    }
  }

  static async getDragableUsers (req, res) {
    try {
      const u = await User.findAll({
        attributes: ['id', 'email', 'username']
      })
      if (!u) { return res.status(404).send({ message: 'no hay usuarios' }) }
      return res.status(200).send(u)
    } catch (e) {
      return res.status(500).send({ message: 'error en el servidor' })
    }
  }
}
