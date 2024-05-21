import { withPageAuthRequired } from '@auth0/nextjs-auth0'

export default function Post() {
  return <div>Post by id page</div>;
}

export const getServerSideProps = withPageAuthRequired(() => {
  return {
    props: {}
  }
})
