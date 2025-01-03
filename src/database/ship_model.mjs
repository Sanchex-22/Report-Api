import { DataTypes, Model } from 'sequelize'
import sequelize from './database_conn.mjs'
import { Reports } from './report_model.mjs'

class Ships extends Model {}

Ships.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('ship', 'company'),
      allowNull: true
    },
    imo: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    flag: {
      type: DataTypes.ENUM('belize', 'panama', 'honduras', 'other'),
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'ships',
    tableName: 'ships',
    hooks: {
      beforeCreate: (report) => {
        if (report.name) report.name = report.name.toLowerCase()
        if (report.imo) report.imo = report.imo.toLowerCase()
        if (report.type) report.type = report.type.toLowerCase()
      },
      beforeUpdate: (report) => {
        if (report.name) report.name = report.name.toLowerCase()
        if (report.imo) report.imo = report.imo.toLowerCase()
        if (report.type) report.type = report.type.toLowerCase()
      }
    }
  }
)

async function setup () {
  try {
    await Ships.sync({ alter: true })
    const count = await Ships.count()
    if (count === 0) {
      await Ships.bulkCreate(
        [
          { name: 'danisa', type: 'SHIP', imo: '9172739', flag: 'panama' },
          { name: 'GOLDEN CONCORD', type: 'SHIP', imo: '1032505', flag: 'honduras' },
          { name: 'SHUN KAI LUN', type: 'SHIP', imo: '1085100', flag: 'belize' }
        ],
        { individualHooks: true } // Activar hooks para cada registro
      )
      console.log('Los registros han sido insertados')
    } else {
      console.log('La tabla ya contiene datos')
    }
  } catch (error) {
    console.error('Error setting up ships:', error)
  }
}

setup().catch((error) => {
  console.error('Error setting up ships:', error)
})

export { Ships }
