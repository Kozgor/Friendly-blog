import { withPageAuthRequired } from '@auth0/nextjs-auth0'

export default function Token() {
  return <div>Token page</div>;
}

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {}
  }
})
