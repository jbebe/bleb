import * as http from 'http';
import express, { Express } from "express";
import { initRoutes } from "./routes";
import { initWebsocket } from "./websocket";
import cors from 'cors';
import bodyParser from 'body-parser';
import { AddressInfo } from 'net';

const port = process.env.PORT || '3001';

function initServer(): Express {
  const app = express();

  // hack cors
  app.use(
    cors({
      origin: (origin, callback) => callback(null, true),
    })
  );
  // add json parser
  app.use(bodyParser.json());
  // init routes
  initRoutes(app);

  return app;
}

export function startServer(){
  const app = initServer();
  const server = http.createServer(app);
  initWebsocket(server, port);
  server.listen(port, () => {
    console.log(`Server started on port ${(server.address() as AddressInfo).port}`);
  });
}