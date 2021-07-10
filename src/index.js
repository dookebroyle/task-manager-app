const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

const app = express()
const port = process.env.PORT || 3000 

app.use(express.json())

//create new user
app.post('/users', async (req, res) => {
    const user = new User(req.body)
    try{
        await user.save()
        res.status(201).send(user)
    } catch (e)  {
        res.status(400).send(e)
    }

})

//get all users
app.get('/users', async (req, res) => {
    try{
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

//get one user
app.get('/users/:id', async (req, res) => {
    const id = req.params.id
    try{
        const user = await User.findById(id)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})

//update existing user
app.patch('/users/:id', async (req, res) => {
    const id = req.params.id
    const allowedUpdates = [ 'name', 'email', 'password', 'age']
    const updates = Object.keys(req.body)
    console.log(updates)
    const isValidOperation = updates.every( update => allowedUpdates.includes(update))
    
    console.log(isValidOperation)
    if (!isValidOperation){
        return res.status(400).send({error: 'Invalid updates'})
    }
    
    try{
        const user = await User.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})
        if (!user){
            res.status(404).send()
        }
        res.send(user)
    }catch (e) {
        res.status(500).send()
    }
})


//create new task
app.post('/tasks', async (req, res) =>{
    const task = new Task(req.body)
    try{
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send()
    }

})

//get all tasks
app.get('/tasks', async (req, res) => {
    try{
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send()
    }
})

//get one task
app.get('/tasks/:id', async (req, res) => {
    const id = req.params.id
    try{
        const task = await Task.findById(id)
        if(!task){
            res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

//update existing task
app.patch('/tasks/:id', async (req, res) => {
    const id = req.params.id
    const allowedUpdates = [ 'description','completed']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every( update => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates'})
    }


    try{
        const task = await Task.findByIdAndUpdate(id, req.body, {new: true, runValidators: true})
        if(!task) {
            res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})


app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})

