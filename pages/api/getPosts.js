import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import clientPromise from '../../lib/mongodb'

export default withApiAuthRequired(async function handler(req, res) {
    try {
        const { user: { sub } } = await getSession(req, res)
        const client = await clientPromise
        const db = client.db('BlogStandart')
        const userProfile = await db.collection('users').findOne({ auth0Id: sub })
        const { getNewerPosts, lastPostDate } = req.body
        const convertedPostDate = new Date(lastPostDate)
        const posts = await db.collection('posts').find({
            userId: userProfile._id,
            created: { [getNewerPosts ? '$gt' : '$lt'] : convertedPostDate }
        }).limit(getNewerPosts ? 0 : 5).sort({created: -1}).toArray()

        return res.status(200).json({ posts })
    } catch (error) {
        console.log('Getting posts error:', error)
    }
})