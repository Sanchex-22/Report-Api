import bcrypt from 'bcryptjs'

async function encrypt (TextPlaint) {
  const hash = await bcrypt.hash(TextPlaint, 8)
  return hash
}
async function compare (passwordPlaint, hashPasword) {
  return await bcrypt.compare(passwordPlaint, hashPasword)
}

export { encrypt, compare }
