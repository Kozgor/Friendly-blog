import { getSession } from "@auth0/nextjs-auth0"
import clientPromise from "../../lib/mongodb"

export default async function handler(req, res) {
    const { user } = await getSession(req, res)
    const client = await clientPromise
    const db = client.db('BlogStandart')

    const userProfile = await db.collection('users').updateOne(
        {
            auth0Id: user.sub
        }, {
            $inc: {
                availableTokens: 20
            },
            $setOnInsert: {
                auth0Id: user.sub
            }
        }, {
            upsert: true
        })

    res.status(200).json({ userProfile })
}
