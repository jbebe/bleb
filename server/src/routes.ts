import { Express } from "express";

const apiPrefix = '/api';

export function initRoutes(app: Express) {
  app.get(`${apiPrefix}`, (req, res) => {
    res.json({ foo: 'bar' });
  });
}