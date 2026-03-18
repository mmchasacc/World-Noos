import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import type { Pool } from "pg";

export class AuthController {
    constructor(private pool: Pool) {}
    


    private generateTokens(user: any) {
        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_ACCESS_TOKEN_SECRET!,
            { expiresIn: '30m' }
        );
        const refreshToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_REFRESH_TOKEN_SECRET!,
            { expiresIn: '1d' }
        )
        return { accessToken, refreshToken }
    }


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

        try {
            const { rows } = await this.pool.query('SELECT * FROM users WHERE username = $1', [username])
            const user = rows[0]
            
            if (user && await bcrypt.compare(password, user.password_hash)) {
                const { accessToken, refreshToken } = this.generateTokens(user) 

                await this.pool.query('INSERT INTO refresh_tokens (token, user_id) VALUES ($1, $2)', [refreshToken, user.id]);

                res.json({ accessToken, refreshToken })
            } else {
                res.status(401).json({ error: "Fel Inloggningsuppgifter"})
            }
        } catch (err) {
            console.error(err)
            res.status(500).json({ error: "Serverfel har inträffat vid inloggning." });
            }
        }

        refresh = async (req: Request, res: Response) => {
            const { refreshToken } = req.body

            if (!refreshToken) return res.status(401).json({ error: "Refresh token saknas"})

            try {
                const { rows } = await this.pool.query('SELECT * FROM refresh_tokens WHERE token = $1', [refreshToken])
                if (rows.length === 0) return res.status(403).json({ error: "Ogiltig refresh token" })

                jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET!, (err: any, user: any) => {
                    if (err) return res.status(403).json({ error: "Token har gått ut" })

                    
                    const accessToken = jwt.sign(
                        { id: user.id, role: user.role },
                        process.env.JWT_ACCESS_TOKEN_SECRET!,
                        { expiresIn: '30m' }
                    )

                    res.json({ accessToken })
                })
            } catch (err) {
                res.status(500).json({ error: "Kunde inte förnya token" })
            }
        }
    }