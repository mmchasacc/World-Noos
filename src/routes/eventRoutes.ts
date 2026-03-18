import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateToken } from '../midwares/authMiddleware';
import { EventController } from '../controllers/eventController';
import { EventRepo } from '../repos/eventRepo';

export const getEventRoutes = (pool: Pool) => {
    const router = Router();
    const repo = new EventRepo(pool)
    const controller = new EventController(repo)

    router.get('/', controller.getEvents)
    router.post('/', authenticateToken, controller.createEvent)
    router.delete('/:id', authenticateToken, controller.deleteEvent)
    router.put('/:id', authenticateToken, controller.updateEvent)

    return router;
};