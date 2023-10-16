import express from 'express'

import { getNotes, getNote, createNote, login_validation} from './database.js'

const app = express()

app.use(express.json())

app.get("/notes", async (req, res) => {
    const notes = await getNotes()
    res.send(notes)
})

app.get("/notes/:id", async (req, res) => {
    const id = req.params.id
    const note = await getNote(id)
    res.send(note)
})

app.post("/notes", async (req, res) => {
    const { user_first_name, user_last_name, user_email, user_password, is_admin} = req.body
    const note  = await createNote(user_first_name, user_last_name, user_email, user_password, is_admin)
    res.status(201).send(note)
})

app.post("/test", async (req, res) => {
    const {  user_email, user_password} = req.body
    const note  = await login_validation(user_email, user_password)
    console.log(note)
    res.status(201).send(note)
    
})

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.listen(8080, () => {
    console.log('Server is running on port 8080')
})