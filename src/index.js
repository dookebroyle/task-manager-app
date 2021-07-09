const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000 

app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User(req.body).save().then(() => {
        res.send(user);
    }).catch( e=> {
        res.send(e)
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

