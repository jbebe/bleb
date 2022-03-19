import { Express } from "express";
import { Synchronizer } from "./synchronizer";

const apiPrefix = '/api';

export function initRoutes(app: Express, synchronizer: Synchronizer) {
  app.get(`${apiPrefix}`, (req, res) => {
    const users = Array.from(synchronizer.users.entries()).map(([uid, data]) => uid);
    res.json(users);
  });
}