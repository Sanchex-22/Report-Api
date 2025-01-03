'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('companies', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      number_ruc: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      company_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    })

    await queryInterface.createTable('department', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      dp_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    })

    // Crear la tabla Employee
    await queryInterface.createTable('employee', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      company: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      start_date: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      end_date: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    })

    // Crear la tabla Vacations
    await queryInterface.createTable('vacations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      days: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      period: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    })

    // Crear la tabla Employee_vacations
    await queryInterface.createTable('employee_vacations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      company: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      total_days: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    })
  },

  async down (queryInterface, Sequelize) {
    // Eliminar las tablas en orden inverso
    await queryInterface.dropTable('Employee_vacations') // Eliminar Employee_vacations
    await queryInterface.dropTable('Vacations')
    await queryInterface.dropTable('Employee')
    await queryInterface.dropTable('Department')
    await queryInterface.dropTable('Companies')
  }
}
