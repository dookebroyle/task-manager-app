require('../src/db/mongoose')
const Task = require('../src/models/task')

Task.findByIdAndRemove("60e86bc525ce453b408c0d2e").then( () => {
    return Task.countDocuments({completed: false})
}).then( result => {
    console.log(result)
}).catch( e => {
    console.log(e)
})