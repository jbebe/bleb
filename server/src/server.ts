import * as http from 'http';
import express, { Express } from "express";
import { initRoutes } from "./routes";
import { initWebsocket } from "./websocket";
import cors from 'cors';
import bodyParser from 'body-parser';
import { AddressInfo } from 'net';
import { Synchronizer } from './synchronizer';

const port = process.env.PORT || '3001';

function initServer(synchronizer: Synchronizer): Express {
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
  initRoutes(app, synchronizer);

  return app;
}

export function startServer(){
  const synchronizer = new Synchronizer();
  const app = initServer(synchronizer);
  const server = http.createServer(app);
  initWebsocket(server, synchronizer);
  server.listen(port, () => {
    const addr = server.address() as AddressInfo;
    console.log(`Server started at ${addr.address}:${addr.port}`);
  });
}