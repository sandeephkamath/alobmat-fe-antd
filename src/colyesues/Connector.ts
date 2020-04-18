import {Client, Room} from "colyseus.js";
import {GameState, Player} from "./entities";

export type PlayerUpdateListener = (player: Player) => void;
export type SetPlayerId = (id: string) => any;
export type SetRoomId = (id: string) => any;
export type NewPlayerListener = (id: string) => any;

export type TurnChangeListener = (isPlayerTurn: boolean, message: string, nextPlayerName: string) => any;


class Connector {

  private room: Room = new Room<any>("");
  private sessionId = "";
  private playerListener?: PlayerUpdateListener;
  private newPlayerListener?: NewPlayerListener;
  private numberPickListener?: (num: number) => void;
  private gameStartListener?: VoidFunction;
  private turnChangeListener?: TurnChangeListener;


  private getEndPoint() {
    let endpoint = window.location.protocol.replace("http", "ws") + "//" + window.location.hostname;
    if (window.location.port && window.location.port !== "80") {
      endpoint += ":2657"
    }
    //return endpoint;
    return "ws://localhost:2567";
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

      room.onMessage((message) => {
        if (message === 'start' && this.gameStartListener) {
          this.gameStartListener();
        } else if (message.nextTurnPlayerId) {
          const isPlayerTurn = message.nextTurnPlayerId === this.sessionId;
          const pickedNumber = message.pickedNumber;
          const pickedByPlayer = message.currentPlayerId === this.sessionId;
          const pickedPlayerName = message.currentPlayerName;
          let messageToDisplay = '';
          if (pickedNumber) {
            messageToDisplay = pickedByPlayer ? `You picked ${pickedNumber}` :
                `${pickedPlayerName} picked ${pickedNumber}`;
          }
          const nextPlayerName = message.nextTurnPlayerName;
          if (this.turnChangeListener) {
            this.turnChangeListener(isPlayerTurn, messageToDisplay, nextPlayerName);
          }
        }
      });

      room.state.pickedNumbers.onAdd = (num) => {
        if (this.numberPickListener) {
          this.numberPickListener(num);
        }
      };

      room.state.players.onAdd = (player, id) => {
        if (id !== this.sessionId) {
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

  setGameStartListener(listener: VoidFunction) {
    this.gameStartListener = listener;
  }

  setTurnChangeListener(listener: TurnChangeListener) {
    this.turnChangeListener = listener;
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
