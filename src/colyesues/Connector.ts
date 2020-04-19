import {Client, Room} from "colyseus.js";
import {GameState, Player, WonPlayer} from "./entities";

export type PlayerUpdateListener = (player: Player) => void;
export type SetRoomId = (id: string) => any;
export type NewPlayerListener = (id: string) => any;
export type OpponentChangeListener = (playerId: string, player: Player) => any;

export type TurnChangeListener = (isPlayerTurn: boolean, message: string, nextPlayerName: string) => any;

export type GameOverListener = (responses: Array<WonPlayer>) => void;

class Connector {

  private room: Room = new Room<any>("");
  private sessionId = "";
  private playerListener?: PlayerUpdateListener;
  private newPlayerListener?: NewPlayerListener;
  private numberPickListener?: (num: number) => void;
  private gameStartListener?: VoidFunction;
  private turnChangeListener?: TurnChangeListener;
  private opponentChangeListener?: OpponentChangeListener;
  private gameOverListener?: GameOverListener;


  private getEndPoint() {
    let endpoint = window.location.protocol.replace("http", "ws") + "//" + window.location.hostname;
    if (window.location.port && window.location.port !== "80") {
      endpoint += ":2657"
    }
    //return endpoint;
    return "wss://alobmat-server.herokuapp.com/";
  }

  joinNew(name: string, setRoomId: SetRoomId, roomId?: string) {
    const endPoint = this.getEndPoint();
    const colyseus = new Client(endPoint);
    let options = {name: name};
    console.log("Trying");
    let roomPromise = roomId ? colyseus.joinById<GameState>(roomId, options) : colyseus.create<GameState>("my_room", options);
    roomPromise.then((room: Room<GameState>) => {
      console.log("joined");
      this.room = room;
      this.sessionId = room.sessionId;
      setRoomId(room.id);
      room.state.players.onChange = (player: Player, id: string) => {
        if (id === this.sessionId) {
          if (this.playerListener) {
            this.playerListener(player);
          }
        } else {
          if (this.opponentChangeListener) {
            this.opponentChangeListener(id, player);
          }
        }
      };

      room.onMessage((message: any) => {
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
        } else if (message.event) {
          const wonResponses: Array<WonPlayer> = message.positions;
          const hasPlayerWon = wonResponses.filter(resp => resp.playerId === this.sessionId).length > 0;
          if (hasPlayerWon && this.gameOverListener) {
            this.gameOverListener(wonResponses);
          }
        }
      });

      room.state.pickedNumbers.onAdd = (num: number) => {
        if (this.numberPickListener) {
          this.numberPickListener(num);
        }
      };

      room.state.players.onAdd = (player: Player, id: string) => {
        if (id !== this.sessionId) {
          if (this.newPlayerListener) {
            this.newPlayerListener(player.name);
          }
        }
      }

    }).catch((e: any) => console.log(e))
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

  setOpponentChangeListener(listener: OpponentChangeListener) {
    this.opponentChangeListener = listener;
  }

  setGameOverListener(listener: GameOverListener) {
    this.gameOverListener = listener;
  }


  start() {
    this.room.send({startGame: true})
  }
}

export const ColyseusConnector = new Connector();
