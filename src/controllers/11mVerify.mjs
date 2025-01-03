import sequelize from '../database/database_conn.mjs'
export class TwelveMonth {
  static async time (id) {
    const fechaActual = new Date()
    console.log(`hoy es ${fechaActual} ${id}`)
    await this.verificarVacaciones({ id })
  }

  static async sumarDias (id, hoy) {
    await sequelize.query(`
        update recursoshumanos.vacations
        set accumulated_vacations = accumulated_vacations + 1,
            accumulated_days = accumulated_days + 15,
            total_vacations = accumulated_vacations * 15,
            status = 1
        where user_id = '${id}' 
        AND next_vacation < '${hoy}';
    `)
  }

  static async restarDias ({ data }, hoy) {
    await sequelize.query(`
        update recursoshumanos.vacations
                set total_vacations = total_vacations - 15,
            accumulated_vacations = accumulated_vacations - 1,
            accumulated_days = accumulated_days - 15
        where user_id = '${data.id}' ;
    `)
  }

  static async nextVacations (id, hoy) {
    const nueva = new Date(hoy)
    nueva.setMonth(nueva.getMonth() + 11)
    const n = this.FormatearFecha(nueva)
    console.log(hoy + ':----------:')
    await sequelize.query(`
        update recursoshumanos.vacations
        set next_vacation = '${n}'
        where user_id = '${id}';
    `)
  }

  static FormatearFecha (originalDate) {
    const newDate = new Date(originalDate)
    const year = newDate.getFullYear()
    const month = String(newDate.getMonth() + 1).padStart(2, '0')
    const day = String(newDate.getDate()).padStart(2, '0')
    const hours = String(newDate.getHours()).padStart(2, '0')
    const minutes = String(newDate.getMinutes()).padStart(2, '0')
    const seconds = String(newDate.getSeconds()).padStart(2, '0')

    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    return formattedDate
  }
}
