import '../styles/globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { DM_Sans, DM_Serif_Display } from '@next/font/google'
import { config } from '@fortawesome/fontawesome-svg-core'
import { PostProvider } from '../context/postsContext'
import { UserProvider } from '@auth0/nextjs-auth0/client'

config.autoAddCss = false

const dmSans = DM_Sans({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-dm-sans'
})

const dmSarif = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-dm-sarif'
})

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <UserProvider>
      <PostProvider>
        <main className={`${dmSans.variable} ${dmSarif.variable} font-body`}>
          {getLayout(<Component {...pageProps} />, pageProps)}
        </main>
      </PostProvider>
    </UserProvider>
  )
}

export default MyApp