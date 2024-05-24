import { pipeline } from '@xenova/transformers'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import clientPromise from '../../lib/mongodb'

export default withApiAuthRequired(async function handler(req, res) {
    const { user } = await getSession(req, res)
    const client = await clientPromise
    const db = client.db('BlogStandart')
    const userProfile = await db.collection('users').findOne({
        auth0Id: user.sub
    })

    if (!userProfile?.availableTokens) {
        return res.status(403)
    }

    const { topic, keywords } = req.body
    const userRequest = keywords ? `${topic} with ${keywords}` : `${topic}`
    const generator = await pipeline('text2text-generation', 'Xenova/flan-alpaca-base')
    const generatedResponse = await generator(userRequest, { max_length: 512, do_sample: true, top_k: 10, })
    const post = generatedResponse[0].generated_text

    await db.collection('users').updateOne({
        auth0Id: user.sub,
    }, {
        $inc: {
            availableTokens: -1
        }
    })

    const postRequest = await db.collection('posts').insertOne({
        post,
        topic,
        keywords,
        userRequest,
        userId: userProfile._id,
        created: new Date()
    })
    
    res.status(200).json({
        postId: postRequest.insertedId,
        topic: postRequest.topic,
        keywords: postRequest.keywords,
    })
})