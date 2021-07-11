const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')
const router = new express.Router()

//create new user
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try{
        const token = await user.generateAuthToken()
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        res.status(201).send({user, token})
    } catch (e)  {
        res.status(400).send(e)
    }
})

//view profile
router.get('/users/me', auth,  async (req, res) => {
    res.send(req.user)
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
router.patch('/users/me', auth, async (req, res) => {
    const allowedUpdates = [ 'name', 'email', 'password', 'age']
    const updates = Object.keys(req.body)
    const isValidOperation = updates.every( update => allowedUpdates.includes(update))
    if (!isValidOperation){
        return res.status(400).send({error: 'Invalid updates'})
    }
    try{
        updates.forEach( update => req.user[update] = req.body[update] )
        await req.user.save()
        res.send(req.user)
    }catch (e) {
        res.status(500).send(e)
    }
})

//delete user
router.delete('/users/me', auth, async (req, res) => {
    try{
        await req.user.remove()
        await sendCancelEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

//upload avatar to profile
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        //restrict file type
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        return cb(undefined, true)
    }
})

//upload an avatar image
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
    
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send ({error: error.message })
})


router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async (req, res) => {
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) {
            throw new Error('No image found')
        }
        res.set('Content-Type','image/png').send(user.avatar)
    } catch (e) {
        res.status(404).send(e)
    }
})




module.exports = router;