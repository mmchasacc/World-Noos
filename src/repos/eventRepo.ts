import { Pool } from 'pg';

export class EventRepo {
    constructor(private pool: Pool) {}

    async getAll() {
        const { rows } = await this.pool.query('SELECT * FROM events ORDER BY event_date DESC');
        return rows;
    }

    async getById(id: number) {
        const { rows } = await this.pool.query('SELECT * FROM events WHERE id = $1', [id]);
        return rows[0];
    }

    async create(title: string, description: string, location: string, actor_id: number | null) {
        const query = `
        INSERT INTO events (title, description, location, actor_id, event_date) 
        VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING *`;
        const { rows } = await this.pool.query(query, [title, description, location, actor_id]);
        return rows[0];
    }

    async update(id: number, title: string, description: string, location: string) {
        const query = `
            UPDATE events SET title = $1, description = $2, location = $3 
            WHERE id = $4 RETURNING *`;
        const { rows } = await this.pool.query(query, [title, description, location, id]);
        return rows[0];
    }

    async delete(id: number) {
        await this.pool.query('DELETE FROM events WHERE id = $1', [id]);
    }
}



/* 
Kör dessa separat i en SQL Editor om det inte fungerar på direkten.

ALTER TABLE events ADD COLUMN location VARCHAR(100);

ALTER TABLE events ALTER COLUMN event_date SET DEFAULT CURRENT_DATE;

ALTER TABLE events ALTER COLUMN event_date DROP NOT NULL;
 */