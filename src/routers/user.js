const express = require('express')
const User = require('../models/user')
const router = new express.Router()

//create new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        await user.save()
        res.status(201).send(user)
    } catch (e)  {
        res.status(400).send(e)
    }
})

//read all users
router.get('/users', async (req, res) => {
    try{
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send()
    }
})

//read one user
router.get('/users/:id', async (req, res) => {
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
router.patch('/users/:id', async (req, res) => {
    const id = req.params.id
    const allowedUpdates = [ 'name', 'email', 'password', 'age']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every( update => allowedUpdates.includes(update))
    
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

//delete user
router.delete('/users/:id', async (req, res) => {
    const id = req.params.id

    try{
        const user = await User.findByIdAndDelete(id)
        if(!user){
            res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router;