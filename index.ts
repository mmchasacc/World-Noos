import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { Pool } from "pg";
import * as dotenv from "dotenv"

dotenv.config()

const app = express()

const port = process.env.PORT || 3000


const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

app.use(helmet())
app.use(express.json())

const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    message: "För många anrop, försök igen senare."

})
app.use(limiter)

app.use(express.static("public"))

app.get('/api/health', async (req, res) => {
    try {
        await pool.query('SELECT NOW()')
        res.json({ status: "OK", message: "Systemet är uppe och databasen svarar."})
    } catch (err) {
        res.status(500).json({ status: "Error", message: "Databasfel"})
    }
})

app.listen(port, () => {
    console.log(`Server körs på http://localhost:${port}`)
})