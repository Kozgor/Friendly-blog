import { getSession } from '@auth0/nextjs-auth0'
import clientPromise from '../lib/mongodb'

export const getAppProps = async (ctx) => {
    const userSession = await getSession(ctx.req, ctx.res)
    const client = await clientPromise
    const db = client.db('BlogStandart')
    const user = await db.collection('users').findOne({ auth0Id: userSession.user.sub })

    if (!user) {
        return {
            availableTokens: 0,
            posts: []
        }
    }

    const posts = await db.collection('posts').find({
        userId: user._id
    }).sort({ created: -1 }).limit(5).toArray()

    return {
        availableTokens: user.availableTokens,
        posts: posts.map(({ _id, topic, userId, created }) => ({
            _id: _id.toString(),
            topic: topic,
            userId: userId.toString(),
            created: created.toString()
        })),
        postid: ctx.params?.postid || null
    }
}