import {Client, Room} from "colyseus.js";
import {GameState, Player} from "./entities";

export type PlayerUpdateListener = (player: Player) => void;
export type SetPlayerId = (id: string) => any;
export type SetRoomId = (id: string) => any;
export type NewPlayerListener = (id: string) => any;


class Connector {

  private room: Room = new Room<any>("");
  private sessionId = "";
  private playerListener?: PlayerUpdateListener;
  private newPlayerListener?: NewPlayerListener;
  private currentPlayerListener?: SetPlayerId;
  private numberPickListener?: (num: number) => void;


  private getEndPoint() {
    let endpoint = window.location.protocol.replace("http", "ws") + "//" + window.location.hostname;
    if (window.location.port && window.location.port !== "80") {
      endpoint += ":2657"
    }
    //return endpoint;
    return "ws://localhost:2567";
  }

  join(name: string, setPlayer: SetPlayerId, roomId?: string) {
    const endPoint = this.getEndPoint();
    const colyseus = new Client(endPoint);
    let roomPromise = roomId ? colyseus.joinById<GameState>(roomId) : colyseus.create<GameState>("my_room");
    roomPromise.then(room => {
      this.room = room;
      this.sessionId = room.sessionId;
      console.log("Room Id " + room.id);
      setPlayer(room.sessionId);
      room.state.players.onChange = (player, id) => {
        if (id === this.sessionId) {
          if (this.playerListener) {
            this.playerListener(player);
          }
        }
      };

      room.state.onChange = (changes) => {
        changes.forEach(change => {
          if (change.field === "currentPlayerId") {
            console.log("Change triggered " + change.value);
            if (this.currentPlayerListener) {
              this.currentPlayerListener(change.value);
            }
          }
        })
      };

      room.state.players.onAdd = (player, id) => {
        console.log("Player added");
      }

    })
  }

  joinNew(name: string, setRoomId: SetRoomId, roomId?: string) {
    const endPoint = this.getEndPoint();
    const colyseus = new Client(endPoint);
    let options = {name: name};
    let roomPromise = roomId ? colyseus.joinById<GameState>(roomId, options) : colyseus.create<GameState>("my_room", options);
    roomPromise.then(room => {
      this.room = room;
      this.sessionId = room.sessionId;
      console.log("Room Id " + room.id);
      setRoomId(room.id);
      room.state.players.onChange = (player, id) => {
        if (id === this.sessionId) {
          console.log("Change triggered for player");
          if (this.playerListener) {
            this.playerListener(player);
          }
        }
      };

      room.state.onChange = (changes) => {
        changes.forEach(change => {
          if (change.field === "currentPlayerId") {
            console.log("Turn Change triggered " + change.value);
            if (this.currentPlayerListener) {
              this.currentPlayerListener(change.value);
            }
          } else {
            console.log("Change in field " + change.field);
            console.log("Change in field  value" + change.value);
          }
        })
      };

      room.state.pickedNumbers.onAdd = (num) => {
        if (this.numberPickListener) {
          this.numberPickListener(num);
        }
      };

      room.state.players.onAdd = (player, id) => {
        if (id !== this.sessionId) {
          console.log(player.name + " was added");
          if (this.newPlayerListener) {
            this.newPlayerListener(player.name);
          }
        }
      }

    })
  }

  send(num: string) {
    this.room.send({number: num})
  }

  sendNumber(num: number) {
    this.room.send({number: num})
  }

  setPlayerListener(listener: PlayerUpdateListener) {
    this.playerListener = listener;
  }

  setCurrentPlayerIdListener(listener: SetPlayerId) {
    this.currentPlayerListener = listener;
  }

  setNewPlayerListener(newPlayerListener: NewPlayerListener) {
    this.newPlayerListener = newPlayerListener;
  }

  setNumberPickListener(numberPickListener: (num: number) => void) {
    this.numberPickListener = numberPickListener;
  }

  start() {
    this.room.send({startGame: true})
  }
}

export const ColyseusConnector = new Connector();
