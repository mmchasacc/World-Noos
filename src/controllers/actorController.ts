import type { Request, Response } from "express";
import type { ActorRepo } from "../repos/actorRepo";

export class ActorController {
  constructor(private repo: ActorRepo) {}

  getActors = async (req: Request, res: Response) => {
    try {
      const actors = await this.repo.getAll();
      res.json(actors);
    } catch (error) {
      res.status(500).json({ error: "Kunde inte hämta aktörer" });
    }
  };

  createActor = async (req: Request, res: Response) => {
    const { name, type, country_origin } = req.body;
    console.log(req.body);
    if (!name || !type) {
      return res.status(400).json({ error: "Namn och typ krävs" });
    }

    try {
      const allActors = await this.repo.getAll();

      const nameExists = allActors.some(
        (actor) => actor.name.toLowerCase() === name.toLowerCase(),
      );

      if (nameExists) {
        return res.status(409).json({ error: "Namnet är upptaget" });
      }

      const newActor = await this.repo.create(name, type, country_origin);
      res.status(201).json(newActor);
    } catch (error: any) {
      console.error(error.message);
      console.error(error.detail);

      res.status(500).json({ error: "Kunde inte skapa aktör" });
    }
  };

  deleteActor = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID saknas i URL:en" });
    }

    const parsedId = parseInt(id as string);

    try {
      const deleted = await this.repo.delete(parsedId);
      if (!deleted)
        return res.status(404).json({ error: "Aktören hittades inte" });
      res.json({ message: "Aktören raderad", actor: deleted });
    } catch (error) {
      res.status(500).json({ error: "Kunde inte radera Aktör" });
    }
  };

  updateActor = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) return res.status(400);
    const parsedId = parseInt(id as string);

    const { name, type, country_origin } = req.body;

    try {
      const allActors = await this.repo.getAll();
      const nameExists = allActors.some(
        (a) => a.name.toLowerCase() === name.toLowerCase && a.id !== id,
      );

      if (nameExists) {
        return res
          .status(409)
          .json({ error: "Namnet är redan upptaget av en annan aktör" });
      }

      const updatedActor = await this.repo.update(
        parsedId,
        name,
        type,
        country_origin,
      );

      if (!updatedActor) {
        return res.status(404).json({ error: "Aktören hittades inte" });
      }

      if (updatedActor) {
        res
          .status(200)
          .json({ message: "Aktören har blivit uppdaterad", updatedActor });
      }
    } catch (error) {
      res.status(500).json({ error: "Kunde inte uppdatera aktör" });
    }
  };
}
