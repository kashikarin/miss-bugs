import express from 'express'
import cors from 'cors'
import { loggerService } from './services/logger.service.js'
import { bugService } from './services/bug.service.js'

const app = express()

const corsOptions = {
    origin: [
        'http://127.0.0.1:5173',
        'http://localhost:5173',
        'http://127.0.0.1:5174',
        'http://localhost:5174',
    ],
    credentials: true,
}

app.use(cors(corsOptions))

app.get('/', (req, res) => res.send('Hello there!!'))

app.get('/api/bug', async (req, res) => {
    try {
        const bugs = await bugService.query()
        res.send(bugs)
    } catch(err) {
        loggerService.error('Server could not get bugs from the DB', err)
        res.status(404).send(err)
    }
})

app.get('/api/bug/save', async (req, res) => {
    const {title, severity, _id, description, createdAt} = req.query
    const bugToSave = {title, severity: +severity, description}
    if (_id) {
        bugToSave._id = _id
        bugToSave.createdAt = createdAt
    }
    try {
        const savedBug = await bugService.save(bugToSave)
        res.send(savedBug)
    } catch(err){
        loggerService.error(err)
        res.status(404).send(err)
    }
})

app.get('/api/bug/:bugId', async (req, res) => {
    const {bugId} = req.params
    try {
        const bug = bugService.getById(bugId)
        res.send(bug)
    } catch(err){
        loggerService.error(`Could not find bug with id ${bugId}`, err);
        res.status(404).send(err)
    }
})

app.get('/api/bug/:bugId/remove', async (req, res) => {
    const bugId = req.params.bugId
    try {
        await bugService.remove(bugId)
        res.send('OK')
    } catch(err) {
        loggerService.error(`Could not remove bug with id ${bugId}`)
        res.status(404).send(err)
    }
})

app.listen(3030, () => console.log('Server ready at port 3030'))
