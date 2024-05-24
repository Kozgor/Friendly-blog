import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AppLayout } from '../components/AppLayout/AppLayout'

export default function TokenTopup() {
  const addTokens = async () => {
    await fetch('/api/addTokens', {
      'method': 'POST'
    })
  }

  return (
    <div>
      <h1>Token page</h1>
      <button onClick={addTokens}>Add 20 tokens</button>
    </div>
  )
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {}
  }
})