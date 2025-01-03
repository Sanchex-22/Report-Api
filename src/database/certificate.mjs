import { DataTypes, Model } from 'sequelize'
import sequelize from './database_conn.mjs'

class Certificates extends Model {}

Certificates.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    certificate_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    abbreviations: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2), // Cambiado a DECIMAL para manejar precios con decimales
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'certificates',
    tableName: 'certificates',
    hooks: {
      beforeCreate: (certificate) => {
        if (certificate.certificate_number) certificate.certificate_number = certificate.certificate_number.toString()
        if (certificate.abbreviations) certificate.abbreviations = certificate.abbreviations.toLowerCase()
        if (certificate.name) certificate.name = certificate.name.toLowerCase()
        // No aplicamos `toLowerCase()` al precio ya que es un número
      },
      beforeUpdate: (certificate) => {
        if (certificate.certificate_number) certificate.certificate_number = certificate.certificate_number.toString()
        if (certificate.abbreviations) certificate.abbreviations = certificate.abbreviations.toLowerCase()
        if (certificate.name) certificate.name = certificate.name.toLowerCase()
        // No aplicamos `toLowerCase()` al precio ya que es un número
      }
    }
  }
)

async function setup () {
  try {
    await Certificates.sync({ alter: true })
    const count = await Certificates.count()
    if (count === 0) {
      await Certificates.bulkCreate(
        [
          { name: 'GARBAGE POLLUTION', abbreviations: 'GP', price: 100 },
          { name: 'SHIP SECURITY PLAN', abbreviations: 'SSP', price: 120 },
          { name: 'SEEMP', abbreviations: 'SEEMP', price: 150 },
          { name: 'PLEASURE VESSEL', abbreviations: 'PV', price: 90 },
          { name: 'PASSENGER SHIP SAFETY CERTIFICATE', abbreviations: 'PSSC', price: 200 },
          { name: 'OIL SEWAGE AND GARBAGE POLLUTION', abbreviations: 'OSGP', price: 110 },
          { name: 'OCCASIONAL SURVEY', abbreviations: 'OS', price: 95 },
          { name: 'TONNAGE NON (REVISA)', abbreviations: 'TNR', price: 85 },
          { name: 'MLC PANAMA', abbreviations: 'MLCP', price: 130 },
          { name: 'MARITIME LABOUR CERTIFICATE OTHER', abbreviations: 'MLCO', price: 125 },
          { name: 'LOADING MANUAL APPROVAL', abbreviations: 'LMA', price: 140 },
          { name: 'LIFTING', abbreviations: 'LIFT', price: 80 },
          { name: 'IHM', abbreviations: 'IHM', price: 75 },
          { name: 'TONNAGE CERTIFICATE', abbreviations: 'TC', price: 150 }
        ],
        { individualHooks: true }
      )
      console.log('Los registros han sido insertados')
    } else {
      console.log('La tabla ya contiene datos')
    }
  } catch (error) {
    console.error('Error setting up certificates:', error)
  }
}

setup().catch((error) => {
  console.error('Error setting up certificates:', error)
})

export { Certificates }
