import { DataTypes, Model } from 'sequelize'
import sequelize from './database_conn.mjs'
import SuperAdminConfig from '../../config/superadmin.mjs'
import { encrypt } from '../utils/EncryptionUtil.mjs'

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(255)
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    blocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    roles: {
      type: DataTypes.ENUM('user', 'moderator', 'admin', 'super_admin')
    },
    status: {
      type: DataTypes.STRING(50)
    },
    img: { // Nuevo campo agregado
      type: DataTypes.STRING,
      allowNull: true // Cambia esto según sea necesario
    }
  },
  {
    sequelize,
    modelName: 'users',
    tableName: 'users'
  }

)

async function setup () {
  await User.sync({ alter: false })
  const pass = await encrypt(SuperAdminConfig.password)
  const [user, created] = await User.findOrCreate({
    where: { roles: 'super_admin' },
    defaults: {
      username: SuperAdminConfig.username,
      email: SuperAdminConfig.email,
      password: pass,
      attempts: SuperAdminConfig.attempts,
      blocked: SuperAdminConfig.blocked,
      roles: SuperAdminConfig.roles,
      status: SuperAdminConfig.status
    }
  })
  if (created) {
    console.log(user.username)
  }
}

setup().catch(error => {
  console.error('Error setting up Users:', error)
})
export { User }
