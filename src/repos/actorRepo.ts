import type { Pool } from "pg";

export class ActorRepo {
  constructor(private pool: Pool) {}

  async getAll() {
    const { rows } = await this.pool.query(
      "SELECT * FROM actors ORDER BY created_at DESC",
    );
    return rows;
  }

  async create(name: string, type: string, country: string) {
    const query =
      "INSERT INTO actors (name, type, country_origin) VALUES ($1, $2, $3) RETURNING *";
    const { rows } = await this.pool.query(query, [name, type, country]);
    return rows[0];
  }

  async delete(id: number) {
    const query = "DELETE FROM actors WHERE id = $1 RETURNING *";
    const { rows } = await this.pool.query(query, [id]);
    return rows[0];
  }

  async update(id: number, name: string, type: string, country: string) {
    const query = `
    UPDATE actors 
    SET name = $1, type = $2, country_origin = $3 
    WHERE id = $4 
    RETURNING *`;
    const { rows } = await this.pool.query(query, [name, type, country, id]);
    return rows[0];
  }
}
