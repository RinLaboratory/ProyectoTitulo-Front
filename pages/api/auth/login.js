import cookie from 'cookie'

import post from '../../../utils/post'

export default async function handler(req, res) {
  const { email, password } = req.body
  const BACKEND_URL = process.env.BACKEND_URL
  const DOMAIN = process.env.DOMAIN
  const response = await post(`${BACKEND_URL}/login`, {
    email,
    password,
  })
  if (response.status === 'success') {
    const jwt = response.token
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('jwt', jwt, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 86400,
        domain: DOMAIN,
        hostOnly: false,
        path: '/',
      }),
    )
  }
  return res.json(response)
}
