const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})











// const today = new Task({
//     description: "study",
//     completed: false
// }).save().then( result => {
//     console.log(result)
// }).catch ( error => {
//     console.log(error.message)
// })

// const them = new User({
//     name: "Yellow",
//     email: "pancasdfddfke@hotmail.com",
//     age: 20,
//     password: '    sdfsdfsdsd re23'
// }).save().then((her) => {
//     console.log(her);
// }).catch( error => {
//     console.log('Error', error)
// })