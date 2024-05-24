import { pipeline } from '@xenova/transformers'

export default async function handler(req, res) {
    const { topic, keywords } = req.body
    const userRequest = keywords ? `${topic} with ${keywords}` : `${topic}`
    const generator = await pipeline('text2text-generation', 'Xenova/flan-alpaca-base')
    const output = await generator(userRequest, { max_length: 512, do_sample: true, top_k: 10, })

    res.status(200).json(output)
}
