const express = require('express')
const axios = require('axios')
const { Client } = require('@notionhq/client')
const dotenv = require('dotenv')

dotenv.config()
const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const notion_key = process.env.NOTION_KEY
const client_id = process.env.CLIENT_ID

app.get('/api/get', (req, res) => {
    res.send('hello')
})

app.get('/notion/callback', (req, res) => {
    const { code } = req.query
    console.log('code => ', code)
    axios({
        method: 'post',
        url: 'https://api.notion.com/v1/oauth/token',
        auth: {
            username: client_id,
            password: notion_key,
        },
        data: {
            grant_type: 'authorization_code',
            code: code,
        },
        headers: { 'Content-Type': 'application/json' },
    })
        .then((response) => {
            const token = response.data.access_token
            const notion = new Client({ auth: token })

            notion
                .search()
                .then((response) => {
                    console.log(response)
                    res.redirect('http://localhost:3000')
                })
                .catch((err) => {
                    console.log(err)
                })
        })
        .catch((err) => {
            console.log(`error-->`, err)
        })
})

app.post('/api/post', async () => {})

app.listen(8080, () => {
    console.log('listen')
    console.log(client_id)
})
