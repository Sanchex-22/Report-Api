import { Certificates } from "../database/certificate.mjs"

/* eslint-disable camelcase */
export class certificatesController {
  static async new (req, res) {
    try {
      //
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: `${error.message}` })
    }
  }

  static async edit (req, res) {
    try {
      //
    } catch (error) {
      return res.status(500).send({ message: 'Error en el servidor' })
    }
  }

  static async delete (req, res) {
    try {
      // const delete = await Form.destroy({})
      //
    } catch (error) {
      return res.status(500).send({ message: 'Error en el servidor' })
    }
  }

  static async get (req, res) {
    try {
      // const i = req.params.id
      // return res.status(200).send(f)
    } catch (error) {
      return res.status(500).send({ message: 'Error en el servidor' })
    }
  }

  static async getAll (req, res) {
    try {
      // Obtenemos los parámetros de paginación del query
      const { page = 1, limit = 50 } = req.query

      // Calculamos el offset
      const offset = (page - 1) * limit

      // Realizamos la consulta con paginación
      const { rows: certificates, count: total } = await Certificates.findAndCountAll({
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        order: [['id', 'ASC']] // Ordenar por ID ascendente (puedes cambiarlo según necesites)
      })

      // Enviamos la respuesta al cliente con los datos paginados
      return res.status(200).json({
        certificates,
        total, // Total de registros en la base de datos
        page: parseInt(page, 10), // Página actual
        limit: parseInt(limit, 10) // Límite de registros por página
      })
    } catch (error) {
      console.error('Error al obtener los certificados:', error)
      return res.status(500).json({ message: 'Error en el servidor' })
    }
  }
}
