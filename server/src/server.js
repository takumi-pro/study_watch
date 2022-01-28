const express = require('express')
const { Client } = require('@notionhq/client')
const dotenv = require('dotenv')

dotenv.config()
const app = express()
const notion_key = process.env.NOTION_KEY
const databaseId = process.env.DATABASE_ID
const notion = new Client({ auth: notion_key })

app.get('/api/get', (req, res) => {
    res.send('hello')
})
app.post('/api/post', async () => {
    try {
        const response = await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                title: {
                    title: [
                        {
                            text: {
                                content: 'hello',
                            },
                        },
                    ],
                },
            },
        })
        console.log(response)
        console.log('Success! Entry added.')
    } catch (error) {
        console.error(error.body)
    }
})

app.listen(8080, () => {
    console.log('listen')
})
