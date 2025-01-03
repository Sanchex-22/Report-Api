import { DataTypes, Model } from 'sequelize'
import sequelize from './database_conn.mjs'
import { Ships } from './ship_model.mjs'

class Reports extends Model {}

Reports.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    name: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    ship_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Ships,
        key: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    },
    imo: {
      type: DataTypes.STRING(300),
      allowNull: true
    },
    certificate: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    certificate_number: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM(
        'full term',
        'interim',
        'annual',
        'initial',
        'renewal',
        'conditional',
        'provisional',
        'special',
        'short term',
        'temporary',
        'harmonized'
      ),
      allowNull: true
    },
    price: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    date_issuance: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_expire: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_endorsement: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_plan_approval: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_create: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'reports',
    tableName: 'reports',
    hooks: {
      beforeSave: (report) => {
        if (report.name) report.name = report.name.toLowerCase()
        if (report.imo) report.imo = report.imo.toLowerCase()
        if (report.certificate) report.certificate = report.certificate.toLowerCase()
        if (report.certificate_number) report.certificate_number = report.certificate_number.toLowerCase()
        if (report.type) report.type = report.type.toLowerCase()
      }
    }
  }
)

async function setup () {
  try {
    await Reports.sync({ alter: true }) // Mover el await dentro de la función asíncrona
    console.log('Tabla reports sincronizada correctamente')
  } catch (error) {
    console.error('Error al sincronizar la tabla reports:', error)
  }
}

setup() // Llamada a la función setup para realizar la sincronización

export { Reports }

Reports.belongsTo(Ships, { foreignKey: 'ship_id' })
