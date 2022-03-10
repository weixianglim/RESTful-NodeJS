// Express module
const express = require('express')
const app = express()

// Run RESTful service
const RESTfulService = require('./RESTfulAPI')
app.use('/api/database', RESTfulService)

// Listen on port 3000
const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}..`))