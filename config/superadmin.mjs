import 'dotenv/config'

export const SuperAdminConfig = {
  username: process.env.SUPER_USERNAME,
  email: process.env.SUPER_EMAIL,
  password: process.env.SUPER_PASSWORD,
  attempts: process.env.SUPER_ATTEMPTS,
  blocked: process.env.SUPER_BLOCKED,
  roles: process.env.SUPER_ROLES,
  status: process.env.SUPER_STATUS
}
export default SuperAdminConfig
