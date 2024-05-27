import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { ObjectId } from 'mongodb'
import clientPromise from '../../lib/mongodb'

export default withApiAuthRequired(async function handler(req, res) {
    try {
        const { postid } = req.body
        const { user: { sub } } = await getSession(req, res)
        const client = await clientPromise
        const db = client.db('BlogStandart')
        const userProfile = await db.collection('users').findOne({ auth0Id: sub })


        await db.collection('posts').deleteOne({
            userId: userProfile._id,
            _id: new ObjectId(postid)
        })

        res.status(200).json({ success: true })

        return
    } catch (error) {
        console.log('Deleting post error:', error)
    }
})