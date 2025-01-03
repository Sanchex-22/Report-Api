import { Sequelize } from 'sequelize'
import { Ships } from '../database/ship_model.mjs'
import { Reports } from '../database/report_model.mjs'

/* eslint-disable camelcase */
export class shipController {
  static async new (req, res) {
    try {
      // Extrae los datos del cuerpo de la solicitud
      let { imo, name, type, flag } = req.body

      // Valida que los valores no sean nulos ni vacíos
      if (!imo || imo.trim() === '') {
        return res.status(400).send({ message: 'IMO es obligatorio' })
      }
      if (!name || name.trim() === '') {
        return res.status(400).send({ message: 'Nombre es obligatorio' })
      }
      if (!type || type.trim() === '') {
        return res.status(400).send({ message: 'Tipo es obligatorio' })
      }
      if (!flag || flag.trim() === '') {
        return res.status(400).send({ message: 'Bandera es obligatoria' })
      }

      // Convierte todos los datos de entrada a minúsculas
      imo = imo.toLowerCase()
      name = name.toLowerCase()
      type = type.toLowerCase()
      flag = flag.toLowerCase()

      // Validaciones de los valores permitidos
      if (!['belize', 'panama', 'honduras', 'other'].includes(flag)) {
        return res.status(404).send({ message: 'Bandera no válida' })
      }
      if (!['ship', 'company'].includes(type)) {
        return res.status(404).send({ message: 'Tipo no válido' })
      }

      // Verifica si ya existe el barco
      const existShip = await Ships.findOne({ where: { imo } })
      if (existShip) {
        return res.status(404).send({ message: 'Ya existe un barco con este IMO' })
      }

      // Crea el barco
      const ship = await Ships.create({
        imo,
        name,
        type,
        flag
      })

      return res.status(200).send({ message: 'Barco creado', ship })
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
      const { uid } = req.query // Corregido: Desestructuración correcta
      console.log(uid)

      // Verificar si el barco existe
      const existShip = await Ships.findOne({ where: { id: uid } })
      if (!existShip) {
        return res
          .status(404)
          .send({ message: 'El barco proporcionado no existe.' })
      }

      // Verificar si el barco está siendo referenciado en la tabla `reports`
      const existReport = await Reports.findOne({ where: { ship_id: uid } })
      if (existReport) {
        return res
          .status(400)
          .send({ message: 'No se puede eliminar el barco porque está siendo utilizado en los informes.' })
      }

      // Eliminar el barco si no hay referencias en `reports`
      const rowsDeleted = await Ships.destroy({ where: { id: uid } })
      if (rowsDeleted === 0) {
        return res
          .status(404)
          .send({ message: 'No se pudo eliminar el barco. Inténtelo nuevamente.' })
      }

      return res
        .status(200)
        .send({ message: 'Barco eliminado con éxito.' })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: 'Error en el servidor' })
    }
  }

  // static async get (req, res) {
  //   try {
  //     // const i = req.params.id
  //     // return res.status(200).send(f)
  //   } catch (error) {
  //     return res.status(500).send({ message: 'Error en el servidor' })
  //   }
  // }

  static async getSearch (req, res) {
    try {
      // Obtenemos el término de búsqueda desde los parámetros de la consulta
      const { searchTerm = '' } = req.query
      console.log(searchTerm)
      // Realizamos la consulta para buscar barcos por el nombre, sin paginación
      const ships = await Ships.findAll({
        where: {
          imo: {
            [Sequelize.Op.like]: `%${searchTerm}%` // Usamos LIKE en lugar de ILIKE
          }
        },
        order: [['id', 'ASC']] // Ordenar por ID ascendente
      })
      if (!ships) { return res.status(404).json({ message: 'no hay data' }) }

      // Enviamos los resultados encontrados
      return res.status(200).json({ ships })
    } catch (error) {
      console.error('Error al obtener los barcos:', error)
      return res.status(500).json({ message: 'Error en el servidor' })
    }
  }

  static async getAll (req, res) {
    try {
      // Obtenemos los parámetros de paginación del query
      const { page = 1, limit = 50 } = req.query

      // Calculamos el offset
      const offset = (page - 1) * limit

      // Realizamos la consulta con paginación
      const { rows: ships, count: total } = await Ships.findAndCountAll({
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        order: [['id', 'ASC']] // Ordenar por ID ascendente (puedes cambiarlo según necesites)
      })

      // Enviamos la respuesta al cliente con los datos paginados
      return res.status(200).json({
        ships,
        total, // Total de registros en la base de datos
        page: parseInt(page, 10), // Página actual
        limit: parseInt(limit, 10) // Límite de registros por página
      })
    } catch (error) {
      console.error('Error al obtener los barcos:', error)
      return res.status(500).json({ message: 'Error en el servidor' })
    }
  }
}
