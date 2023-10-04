import NavBar from '@/components/NavBar/NavBar'
import '@/styles/globals.scss'
import jwt from 'jsonwebtoken'
import Head from 'next/head'

import { ChakraProvider } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const blockedPages = [
  '/login',
  '/signup',
  '/logout',
  '/reset-password/[token]',
  '/_error',
  '/reset-password',
  '/forgot-password',
]

function App({ Component, pageProps }) {
  const router = useRouter()

  return (
  <>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=0.6" />
    </Head>
    <ChakraProvider>
      {!blockedPages.includes(router.pathname) && <NavBar />}
      <div className="super">
        <div className="main">
          <Component {...pageProps} />
        </div>
      </div>
    </ChakraProvider>
  </>
  )
}

App.getInitialProps = async ({ ctx }) => {
  const { req, res } = ctx

  if (
    req &&
    !req.url.includes('/login') &&
    !req.url.includes('/logout') &&
    !req.url.includes('/signup') &&
    !req.url.includes('/reset-password') &&
    !req.url.includes('/forgot-password')
  ) {
    // check if logged in
    let isLoggedIn
    const accessToken = req.cookies.jwt

    var asd = ''
    try {
      asd = jwt.verify(accessToken, process.env.JWT_SECRET)
      isLoggedIn = true
    } catch (err) {
      isLoggedIn = false
    }
    if (!isLoggedIn) {
      res.writeHead(307, {
        Location: '/login',
      })
      res.end()
    }
  }

  return {
    pageProps: {},
  }
}

export default App