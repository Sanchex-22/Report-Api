import jwt from 'jsonwebtoken'
import 'dotenv/config'
export class AuthMiddlewire {
  static Authorization = (request, response, next) => {
    try {
      const Authorization = request.get('authorization')
      let token = ''

      if (Authorization && Authorization.toLowerCase().startsWith('bearer')) {
        token = Authorization.substring(7)
      }
      const decodedToken = jwt.verify(token, process.env.SECRET_KEY)

      if (!token || !decodedToken.metaData.id) {
        return response.status(401).json({ error: 'token invalido o ha expirado' })
      }
      const { id: userId } = decodedToken.metaData
      request.userId = userId
      next()
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        response.status(401).json({ error: 'token expirado' })
      } else {
        response.status(401).json({ error: 'Error al verificar el token:' })
      }
    }
  }

  static ClerkAuthorization = (request, response, next) => {
    const publicKey = process.env.CLERK_PEM_PUBLIC_KEY
    const authorizationHeader = request.get('Authorization')

    try {
      if (!authorizationHeader || !authorizationHeader.toLowerCase().startsWith('bearer ')) {
        return response.status(401).json({ error: 'Missing or invalid authorization header' })
      }

      const token = authorizationHeader.substring(7)
      console.log(token)
      const decoded = jwt.verify(token, publicKey)

      console.log(decoded)
      response.locals.sessToken = decoded
      next()
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return response.status(401).json({ error: 'Token expired' })
      } else if (error instanceof jwt.JsonWebTokenError) {
        return response.status(401).json({ error: 'Invalid token' })
      } else {
        return response.status(500).json({ error: 'Internal server error' })
      }
    }
  }
}
