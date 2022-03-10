// Express framework for RESTful APIs
const express = require('express')
const Joi = require('joi')
const router = express.Router()

/* 
    RESTful API/service:
    - Representational State Transfer
    - Create Read Update Delete (CRUD) operations
    - Typical url for RESTful APIs: http://domain.com/api/resource
    - CRUD requests for that particular resource will be sent to that endpoint
    - Http methods: GET, POST, PUT, DELETE
    Examples:
    GET /api/customers
    GET /api/customers/1     -> specific customer (id)
    PUT /api/customers/1
    DELETE /api/customers/1
    POST /api/customers
    - In essence, RESTful service/API:
    Expose resources using a simple meaningful address and support
    various operations (CRUD) around them using standard http methods.

    Express.Router():
    - This class can be used to create modular, mountable route handlers. 
    - A Router instance is a complete middleware and routing system.
    - For this reason, it is often referred to as a "mini-app".
      E.g. In this case, 'RESTfulAPI' module is it's own mini-app with it's own routes etc.
           Domain name (/api/database) is specified in app.js, which will be the root ('/')
           specified in this module.
    - app.get(), app.post(), etc. can be used instead of router.get(), post(), etc., but the full domain 
      name will have to be specified everytime (get /api/database/:id, post /api/database, etc.)
*/

// === RESTful APIs example === //

// Database
database = [
    { id: 1, name: "entry1" },
    { id: 2, name: "entry2" },
    { id: 3, name: "entry3" },
    { id: 4, name: "entry4" },
    { id: 5, name: "entry5" }
]

// Middlewares specific to this module that is called every request
router.use((req, res, next) => {
    console.log('Router module (RESTfulAPI) has received a request.')
    next()
})
router.use(express.json())

// Root (/api/database)
router.get('/', (req, res) => {
    res.send(database)
})

// Get request (/api/database/:id)
router.get('/:id', (req, res) => {
    const entry = database.find(e => e.id === parseInt(req.params.id))
    if (!entry)
        return res.status(404).send("Entry id not found.")  // send msg is optional
    res.send(entry)
})

// Validate queries with joi module
function ValidateQuery(query) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    })
    return schema.validate(query)
}

// Post request (/api/database)
router.post('/', (req, res) => {
    // Validate query
    result = ValidateQuery(req.body)
    if (result.error)
        return res.status(400).send(result.error)

    // Add to database 
    const newEntry = {
        id: database.length + 1,
        name: req.body.name
    }
    database.push(newEntry)

    res.send(newEntry)
})

// Put request (/api/database/:id)
router.put('/:id', (req, res) => {
    const entry = database.find(e => e.id === parseInt(req.params.id))
    if (!entry)
        return res.status(404).send("Entry id not found.")

    // Validate query
    result = ValidateQuery(req.body)
    if (result.error)
        return res.status(400).send(result.error)

    // Update entry
    entry.name = req.body.name

    res.send(entry)
})

// Delete request (/api/database/:id)
router.delete('/:id', (req, res) => {
    const entry = database.find(e => e.id === parseInt(req.params.id))
    if (!entry)
        return res.status(404).send("Entry id not found.")

    // Delete entry
    database.splice(database.indexOf(entry), 1)

    res.send(entry)
})

// * CRUD requests can be tested with Postman

// Export router
module.exports = router