import type { Request, Response } from "express";
import type { EventRepo } from "../repos/eventRepo";

export class EventController {
  constructor(private repo: EventRepo) {}

  getEvents = async (req: Request, res: Response) => {
    const events = await this.repo.getAll();
    res.json(events);
  };

  createEvent = async (req: Request, res: Response) => {
    const { title, description, location, actor_id } = req.body;
    if (!title) return res.status(400).json({ error: "Titel krävs" });

    console.log("Data mottagen:", { title, description, location, actor_id })

    const newEvent = await this.repo.create(
      title,
      description,
      location,
      actor_id,
    );
    res.status(201).json(newEvent);
  };

  deleteEvent = async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    await this.repo.delete(id);
    res.status(204).json({ message: "Event har blivit raderad!" });
  };

  updateEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) return res.status(400);
    const parsedId = parseInt(id as string);

    const { title, description, location, actor_id } = req.body;

    try {
      const allEvents = await this.repo.getAll();
      const nameExists = allEvents.some(
        (a) => a.title.toLowerCase() === title.toLowerCase && a.id !== id,
      );

      if (nameExists) {
        return res
          .status(409)
          .json({ error: "Denna namn finns hos ett annat Event." });
      }

      const updatedEvent = await this.repo.update(
        parsedId,
        description,
        location,
        actor_id,
      );

      if (!updatedEvent) {
        return res.status(404).json({ error: "Event hittades inte" });
      }

      if (updatedEvent) {
        res
          .status(200)
          .json({ message: "Event har blivit uppdaterad", updatedEvent });
      }
    } catch (error) {
      res.status(500).json({ error: "Kunde inte uppdatera Event" });
    }
  };
}
