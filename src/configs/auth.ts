import { AuthConfig } from '@/interfaces'

export const authConfig: AuthConfig = {
  jwt: {
    secret: process.env.AUTH_SECRET || 'default',
    expiresIn: '1d',
  },
}
