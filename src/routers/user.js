const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()



//create new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        const token = await user.generateAuthToken()
        await user.save()
        res.status(201).send({user, token})
    } catch (e)  {
        res.status(400).send(e)
    }
})

//user login
router.post ('/users/login', async (req, res) =>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch (e) {
        res.status(400).send()
    }
})

//user logout
router.post('/users/logout', auth, async (req, res) => {
    try { 
        req.user.tokens = req.user.tokens.filter( token => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) { 
        res.status(500).send()
    }
})

//user logout of all sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})



//update existing user
router.patch('/users/:id', async (req, res) => {
    const allowedUpdates = [ 'name', 'email', 'password', 'age']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every( update => allowedUpdates.includes(update))
    
    if (!isValidOperation){
        return res.status(400).send({error: 'Invalid updates'})
    }
    
    try{
        const user = await User.findById(req.params.id)

        updates.forEach( update => user[update] = req.body[update])
        await user.save()

        if (!user){
            res.status(404).send()
        }
        res.send(user)
    }catch (e) {
       if(e.errors.password.properties.message){
        return res.status(400).send(e.errors.password.properties.message)
       }
        res.status(500).send()
    }
})

//delete user
router.delete('/users/me', auth, async (req, res) => {
    try{
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router;