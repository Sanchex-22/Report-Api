import { Op } from 'sequelize'
import { Reports } from '../database/report_model.mjs'
import { Ships } from '../database/ship_model.mjs'

/* eslint-disable camelcase */
export class reportController {
  static async new (req, res) {
    try {
      // Extraer los datos del body
      const {
        name,
        imo,
        certificate,
        certificate_number,
        type,
        price,
        date_issuance,
        date_expire,
        date_endorsement,
        date_plan_approval
      } = req.body

      // Validar campos obligatorios
      if (
        !name ||
        !imo ||
        !certificate ||
        !certificate_number ||
        !type ||
        !price
      ) {
        return res.status(400).json({
          message: 'Llene los campos obligatorios.'
        })
      }

      // Validar tipo de datos y formatos
      if (
        typeof name !== 'string' ||
        typeof imo !== 'string' ||
        typeof certificate !== 'string' ||
        typeof certificate_number !== 'string' ||
        typeof type !== 'string'
      ) {
        return res.status(400).json({
          message:
            "Los campos 'name', 'imo', 'certificate', 'certificate_number' y 'type' deben ser cadenas de texto."
        })
      }

      if (isNaN(Number(price))) {
        return res.status(400).json({
          message: "'price' debe ser un número."
        })
      }

      // Normalizar fechas: si están vacías o no tienen formato válido, asignar null
      const normalizeDate = (date) =>
        date && !isNaN(Date.parse(date)) ? new Date(date) : null

      const normalizedDates = {
        date_issuance: normalizeDate(date_issuance),
        date_expire: normalizeDate(date_expire),
        date_endorsement: normalizeDate(date_endorsement),
        date_plan_approval: normalizeDate(date_plan_approval)
      }

      // Validar que el IMO exista en la base de datos
      const ship = await Ships.findOne({ where: { imo } })
      if (!ship) {
        return res
          .status(404)
          .send({ message: 'El barco con el IMO proporcionado no existe.' })
      }

      // Crear el reporte con la fecha actual
      const report = await Reports.create({
        name,
        ship_id: ship.id, // Asignar el ID del barco
        imo,
        certificate,
        certificate_number,
        type,
        price: parseFloat(price),
        ...normalizedDates, // Añadir las fechas normalizadas
        date_create: new Date() // Fecha actual
      })

      // Responder con éxito
      return res.status(200).json({
        message: 'Reporte creado exitosamente.',
        data: report
      })
    } catch (error) {
      console.error(error)
      return res.status(500).send({ message: `${error.message}` })
    }
  }

  static async edit (req, res) {
    try {
      const { uid } = req.query // Corregido: Desestructuración correcta
      console.log(uid)
      return res.status(200).send({ message: 'Reporte editado con éxito.' })
    } catch (error) {
      return res.status(500).send({ message: 'Error en el servidor' })
    }
  }

  static async delete (req, res) {
    try {
      const { uid } = req.query // Corregido: Desestructuración correcta
      console.log(uid)

      // Verificar si el reporte existe
      const existReport = await Reports.findOne({ where: { id: uid } })
      if (!existReport) {
        return res
          .status(404)
          .send({ message: 'El reporte proporcionado no existe.' })
      }

      // Eliminar el reporte
      const rowsDeleted = await Reports.destroy({ where: { id: uid } })
      if (rowsDeleted === 0) {
        return res
          .status(404)
          .send({ message: 'No se pudo eliminar el reporte. Inténtelo nuevamente.' })
      }

      return res
        .status(200)
        .send({ message: 'Reporte eliminado con éxito.' })
    } catch (error) {
      console.error(error)
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
      const { page = 1, limit = 50 } = req.query

      const offset = (page - 1) * limit

      // Obtener reportes con datos del barco asociado
      const { rows: reports, count: total } = await Reports.findAndCountAll({
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        order: [['id', 'ASC']],
        include: [
          {
            model: Ships,
            attributes: ['id', 'name', 'imo', 'type', 'flag'] // Selecciona los campos necesarios
          }
        ]
      })

      return res.status(200).json({
        reports,
        total
      })
    } catch (error) {
      console.error('Error al obtener los reportes:', error)
      return res.status(500).json({ message: 'Error en el servidor' })
    }
  }

  static async ultimosCreados (req, res) {
    try {
      const { page = 1, limit = 50 } = req.query

      const offset = (page - 1) * limit

      // Obtener la fecha actual y fechas relevantes
      const now = new Date()
      const today = new Date(now.setHours(0, 0, 0, 0)) // Hoy a las 00:00
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1) // Ayer
      const lastWeek = new Date(today)
      lastWeek.setDate(today.getDate() - 7) // Hace una semana
      const lastMonth = new Date(today)
      lastMonth.setMonth(today.getMonth() - 1) // Hace un mes

      // Obtener reportes sin filtrar aún por fecha
      const { rows: reports, count: total } = await Reports.findAndCountAll({
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        order: [['createdAt', 'DESC']], // Ordenar por fecha de creación (más recientes primero)
        include: [
          {
            model: Ships,
            attributes: ['id', 'name', 'imo', 'type', 'flag']
          }
        ]
      })

      // Categorizar los reportes según la fecha
      const categorizedReports = {
        today: [],
        yesterday: [],
        thisWeek: [],
        lastMonth: [],
        older: []
      }

      reports.forEach(report => {
        const createdAt = new Date(report.createdAt)

        // Categorizar por Hoy
        if (createdAt >= today) {
          categorizedReports.today.push(report)
        }
        // Categorizar por Ayer
        else if (createdAt >= yesterday && createdAt < today) {
          categorizedReports.yesterday.push(report)
        }
        // Categorizar por Esta Semana (últimos 7 días)
        else if (createdAt >= lastWeek && createdAt < today) {
          categorizedReports.thisWeek.push(report)
        }
        // Categorizar por Hace un mes
        else if (createdAt >= lastMonth && createdAt < lastWeek) {
          categorizedReports.lastMonth.push(report)
        }
        // Categorizar por reportes más antiguos
        else {
          categorizedReports.older.push(report)
        }
      })

      return res.status(200).json({
        categorizedReports,
        total
      })
    } catch (error) {
      console.error('Error al obtener los reportes:', error)
      return res.status(500).json({ message: 'Error en el servidor' })
    }
  }

  static async getFilterReport (req, res) {
    try {
      const { startDate, endDate } = req.query

      // Validar que las fechas sean proporcionadas y válidas
      if (
        startDate &&
        endDate &&
        (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate)))
      ) {
        return res
          .status(400)
          .json({ message: 'Las fechas proporcionadas no tienen un formato válido.' })
      }

      const dateFilter =
        startDate && endDate
          ? {
              date_create: {
                [Op.between]: [new Date(startDate), new Date(endDate)]
              }
            }
          : {}

      // Obtener los reportes desde la base de datos
      const { rows: reports } = await Reports.findAndCountAll({
        where: dateFilter,
        order: [['id', 'ASC']],
        include: [
          {
            model: Ships,
            attributes: ['id', 'name', 'imo', 'type', 'flag'] // Selecciona los campos necesarios
          }
        ]
      })

      // Mapeo de los resultados con datos de Ships
      const mappedReports = reports.map((report) => ({
        id: report.id,
        name: report.name,
        imo: report.imo,
        certificate: report.certificate,
        type: report.type,
        certificateNumber: report.certificate_number,
        price: report.price,
        dateIssuance: report.date_issuance,
        dateExpire: report.date_expire,
        dateEndorsement: report.date_endorsement,
        datePlanApproval: report.date_plan_approval,
        dateCreate: report.date_create,
        // Acceder a los datos de Ship a través de la relación
        ship: report.ship
          ? {
              id: report.ship.id,
              name: report.ship.name,
              imo: report.ship.imo,
              type: report.ship.type,
              flag: report.ship.flag
            }
          : null
      }))

      // Calcular la suma total de los precios
      const totalSum = mappedReports.reduce((sum, report) => sum + report.price, 0)

      // Responder con los datos filtrados
      return res.status(200).json({
        reports: mappedReports,
        total: mappedReports.length,
        totalSum,
        range: {
          startDate: startDate || null,
          endDate: endDate || null
        }
      })
    } catch (error) {
      console.error('Error al obtener los reportes:', error)
      return res.status(500).json({ message: 'Error en el servidor' })
    }
  }
}
