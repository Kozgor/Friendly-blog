import { useContext, useEffect } from 'react'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { useUser } from '@auth0/nextjs-auth0/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Logo } from '../Logo'
import Image from 'next/image'
import Link from 'next/link'
import PostContext from '../../context/postsContext'

export const AppLayout = ({ children, availableTokens, posts: postsFromSSR, postid, created }) => {
    const { user } = useUser()
    const { setPostsFromSSR, getPosts, posts, isNoMorePosts } = useContext(PostContext)

    useEffect(() => {
        setPostsFromSSR(postsFromSSR)

        if (postid) {
            const exists = postsFromSSR.find(post => postid === post._id)

            if (!exists) {
                getPosts({ lastPostDate: created, getNewerPosts: true })
            }
        }
    }, [postid, created, postsFromSSR, setPostsFromSSR, getPosts])

    return (
        <div className='grid grid-cols-[300px_1fr] h-screen max-h-screen'>
            <div className='flex flex-col text-white overflow-hidden'>
                <div className='bg-slate-800 px-2'>
                    <Logo />
                    <Link
                        href='/post/new'
                        className='btn'
                    >
                        New post
                    </Link>
                    <Link href='/token-topup' className='block mt-2 text-center'>
                        <FontAwesomeIcon icon={faCoins} className='text-yellow-500 ' />
                        <span className='pl-1'>{availableTokens} Tokens available</span>
                    </Link>
                </div>
                <div className='flex-1 px-4 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800'>
                    {posts?.map((post, i) =>
                        <Link
                            key={`${i}+${post.topic}`}
                            href={`/post/${post._id}`}
                            className={`border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-1 px-2 bg-white/10 cursor-pointer rounded-sm ${postid === post._id ? 'bg-white/20 border-white' : ''}`}
                        >
                            {post.topic}
                        </Link>
                    )}
                    {!isNoMorePosts && <div>
                        <button
                            className='hover:underline text-sm text-center text-slate-400 cursor-pointer mt-4'
                            onClick={() => {
                                getPosts({ lastPostDate: posts[posts.length - 1]?.created })
                            }}
                        >Load more posts</button>
                    </div>}
                </div>
                <div className='flex items-center border-t border-t-black/50 gap-2 h-20 px-2 bg-cyan-800'>
                    {!!user ? <>
                        <div className='min-w-[50px]'>
                            <Image
                                src={user.picture}
                                alt={user.name}
                                height={50} width={50}
                                className='rounded-full'
                            />
                        </div>
                        <div className='flex-1'>
                            <div className='font-bold'>{user.email}</div>
                            <Link className='text-sm' href='/api/auth/logout'>Logout</Link>
                        </div>
                    </> : <Link href='/api/auth/login'>Login</Link>}
                </div>
            </div>
            {children}
        </div>
    )
}