import 'dotenv/config'
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'
console.log('CLERK_TOKEN:', process.env.CLERK_TOKEN)
const clerkMiddleware = ClerkExpressWithAuth({
  apiKey: process.env.CLERK_TOKEN,
  secretKey: 'my-secret-rh',
  sessionConfig: {
    cookieName: 'clerk-session'
  }
})
export default clerkMiddleware
