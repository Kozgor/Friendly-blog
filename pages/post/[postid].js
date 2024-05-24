import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default function Post(props) {
  return (
    <div className='overflow-auto h-full'>
      <div className='max-w-screen-sm mx-auto'>
        <div className='text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm'> Blog post</div>
        <div>{props.post}</div>
      </div>
    </div>
  )
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const userSession = await getSession(ctx.req, ctx.res)
    const client = await clientPromise
    const db = await client.db('BlogStandart')
    const user = await db.collection('users').findOne({
      auth0Id: userSession.user.sub
    })

    const postResul = await db.collection('posts').findOne({
      _id: new ObjectId(ctx.params.postId),
      userId: user._id
    })

    if (!postResul) {
      return {
        redirect: {
          destination: '/post/new',
          permanent: false
        }
      }
    }

    return {
      props: {
        post: postResul.post,
        topic,
        keywords,
        created
      }
    }
  }
})
