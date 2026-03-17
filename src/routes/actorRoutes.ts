import { Router } from 'express';
import { ActorController } from '../controllers/actorController';
import { Pool } from 'pg';
import { ActorRepo } from '../repos/actorRepo';
import { authenticateToken } from '../midwares/authMiddleware';

export function getActorRoutes(pool: Pool) {
  const router = Router();
  const repo = new ActorRepo(pool);
  const controller = new ActorController(repo);

  router.get('/', controller.getActors);
  router.post('/', controller.createActor)
  router.delete('/:id', controller.deleteActor)
  router.put('/:id', controller.updateActor)

  return router;
}