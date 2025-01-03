# Ticket_api

SELECT 
    Employee.id AS employee_id, 
    Employee.name, 
    Employee.last_name, 
    Employee.company, 
    Users.id AS user_id,
    Users.email,
    Vacations.period,
    SUM(Vacations.days) AS total_days
FROM 
    Employee
INNER JOIN
    Users
ON
    Employee.user_id = Users.id
LEFT JOIN 
    Vacations 
ON 
    Vacations.employee_id = Employee.id
WHERE 
    Users.id = '92b166d9-e12e-47f2-ad2a-2c491290c9e6'
GROUP BY 
    Employee.id, 
    Employee.name, 
    Employee.last_name, 
    Employee.company,
    Users.id,
    Users.email,
    Vacations.period;#   R e p o r t - A p i  
 # Report-Api
