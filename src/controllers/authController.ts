import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Pool } from "pg";

export class AuthController {
    constructor(private pool: Pool) {}
    
    register = async (req: Request, res: Response) => {
        const { username, password } = req.body
        const hash = await bcrypt.hash(password, 10)
        try {
            await this.pool.query('INSERT INTO users (username, password_hash) VALUES ($1, $2)', [username, hash]);
            res.status(201).json({ message: "Användare skapad" })
        } catch (e) {
            res.status(400).json({ error: "Användarnamnet upptaget" })
        }
    }

    login = async (req: Request, res: Response) => {
        const { username, password } = req.body
        const { rows } = await this.pool.query('SELECT * FROM users WHERE username = $1', [username])
        const user = rows[0]

        if (user && await bcrypt.compare(password, user.password_hash)) {
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET!, {
                expiresIn: '1h'
            })
            res.json({ token })
        } else {
            res.status(401).json({ error: "Fel inloggningsuppgifter" })
        }
    }
}