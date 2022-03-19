export enum MessageType {
  NewPlayer,
  MovePlayer,
}

export type RawVector3 = {
  x: number
  y: number
  z: number
}

export type Message = {
  type: MessageType
}

export type NewPlayerMessage = Message & {
  playerId: number
}

export type MovePlayerMessage = Message & {
  playerId: number
  position: RawVector3
}
