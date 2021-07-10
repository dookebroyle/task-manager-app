require('../src/db/mongoose')
const User = require('../src/models/user')

User.findByIdAndUpdate('60e8738923aee9574c30ecac', { age: 1}).then( (user) => {
    console.log(user);
    return User.countDocuments({age: 1})
}).then((result) => {
    console.log(result)
}).catch(e => {
    console.log(e)
})
