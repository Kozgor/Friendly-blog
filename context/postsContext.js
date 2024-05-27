import { createContext, useCallback, useReducer, useState } from 'react'

const PostContext = createContext({})

export default PostContext

function PostReducer(state, action) {
    switch (action.type) {
        case 'addPosts': {
            const newPosts = [...state]

            action.posts.forEach(post => {
                const exist = newPosts.find(p => p._id === post._id)

                if (!exist) {
                    newPosts.push(post)
                }
            })
            return newPosts
        }

        case 'deletePost': {
            const newPosts = []

            state.forEach(post => {
                if (post._id !== action.postid) {
                    newPosts.push(post)
                }
            })

            return newPosts
        }

        default: return state
    }
}

export const PostProvider = ({ children }) => {
    const [posts, dispatch] = useReducer(PostReducer, [])
    const [isNoMorePosts, setIsNoMorePosts] = useState(false)

    const setPostsFromSSR = useCallback((postsFromSSR = []) => {
        dispatch({ type: 'addPosts', posts: postsFromSSR })
    }, [])

    const getPosts = useCallback(async ({ lastPostDate, getNewerPosts = false }) => {
        const result = await fetch('/api/getPosts', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ lastPostDate, getNewerPosts })
        })

        const json = await result.json()
        const postsResult = json.posts || []

        if (!postsResult.length) {
            setIsNoMorePosts(true)
        }

        dispatch({ type: 'addPosts', posts: postsResult })
    }, [])

    const deletePost = useCallback(async (postid) => {
        dispatch({ type: 'deletePost', postid})
    }, [])

    return (
        <PostContext.Provider value={{ posts, isNoMorePosts, setPostsFromSSR, getPosts, deletePost }}>{children}</PostContext.Provider>
    )
}