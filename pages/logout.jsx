import React from 'react'

import { useRouter } from 'next/router'

export default function Logout() {
  const router = useRouter()

  router.push({
    pathname: '/login',
  })

  return <div>Logout</div>
}

export async function getServerSideProps(ctx) {
  const { req, res } = ctx
  if (req) {
    // delete cookie
    const cookieString = `jwt=deleted; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
    res.setHeader('Set-Cookie', [cookieString])

    // redirect to login
    res.writeHead(302, {
      Location: '/login',
    })

    res.end()
  }
  return {
    props: {},
  }
}
