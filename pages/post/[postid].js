import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { faHashtag } from '@fortawesome/free-solid-svg-icons'
import { AppLayout } from '../../components/AppLayout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ObjectId } from 'mongodb'
import { getAppProps } from '../../utils/getAppProps'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'

import clientPromise from '../../lib/mongodb'
import PostContext from '../../context/postsContext'

export default function Post(props) {
  const { topic, keywords, post, postid } = props
  const [isShowDeleteConfirm, setIsShowDeleteConfirm] = useState(false)
  const router = useRouter()
  const { deletePost } = useContext(PostContext)

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch('/api/deletePost', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ postid })
      })

      const json = await response.json()

      if (json.success) {
        router.push('/post/new')
        deletePost(postid)
        setIsShowDeleteConfirm(false)
      }
    } catch (error) {
      setIsShowDeleteConfirm(false)
    }
  }

  return (
    <div className='overflow-auto h-full'>
      <div className='max-w-screen-sm mx-auto'>
        <div className='text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm text-center'>
          <h1>Blog post</h1>
        </div>
        <div className='p-4 my-2 border border-stone-200 rounded-md'>
          <div className='text-blue-600 text-2xl font-bold'>
            {topic}
          </div>
          <div className='flex flex-wrap pt-2 gap-1'>
            {keywords ? keywords.split(',').map((keyword, i) =>
              <div
                className='p-2 rounded-full bg-slate-800 text-white'
                key={`${keyword}+${i}`}
              ><FontAwesomeIcon icon={faHashtag} /> {keyword}</div>
            ) : null}
          </div>
        </div>
        <div className='text-sm font-bold mt-6 p-2 rounded-sm'>{post}</div>
        <div className='my-4'>
          {!isShowDeleteConfirm && (<button
            className='btn bg-red-600 hover:bg-red-700'
            onClick={() => { setIsShowDeleteConfirm(true) }}
          >
            Delete post
          </button>)}
          {!!isShowDeleteConfirm && (<div className='block confirmation-dialog'>
            <p className='p-2 bg-red-300 text-center'>Are you sure you want to delete this post?</p>
            <div className='grid grid-cols-2 gap-2'>
              <button
                className='btn bg-red-600 hover:bg-red-700'
                onClick={() => { handleDeleteConfirm() }}
              >
                Delete
              </button>
              <button
                className='btn bg-stone-600 hover:bg-stone-700'
                onClick={() => { setIsShowDeleteConfirm(false) }}
              >
                Cancel
              </button>
            </div>
          </div>)
          }
        </div>
      </div>
    </div>
  )
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    const userSession = await getSession(ctx.req, ctx.res)
    const client = await clientPromise
    const db = client.db('BlogStandart')
    const user = await db.collection('users').findOne({
      auth0Id: userSession.user.sub
    })

    const postResult = await db.collection('posts').findOne({
      _id: new ObjectId(ctx.params?.postid),
      userId: user._id
    })

    if (!postResult) {
      return {
        redirect: {
          destination: '/post/new',
          permanent: false
        }
      }
    }

    return {
      props: {
        postid: ctx.params.postid,
        topic: postResult.topic,
        keywords: postResult.keywords,
        post: postResult.post,
        created: postResult.created.toString(),
        ...props
      }
    }
  }
})