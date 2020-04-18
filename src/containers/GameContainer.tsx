import React, {useEffect, useState} from "react";
import {NameContainer} from "./NameContainer";
import {message, Row} from "antd";
import {RoomCreateOptionContainer} from "./RoomCreateOptionContainer";
import {GameState} from "./GameState";
import * as queryString from 'query-string';
import {WaitingToJoinContainer} from "./WaitingToJoinContainer";
import {ColyseusConnector} from "../colyesues/Connector";
import {PlayerArea} from "./PlayerArea";
import {Chit, Player} from "../colyesues/entities";

export interface GameContainerProps {
  opponentsUpdate: (map: Map<string, Player>) => void;
}

export const GameContainer = (props: GameContainerProps) => {

  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [nextPlayerName, setNextPlayerName] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [isPlayerTurn, setIsMyTurn] = useState(false);
  const [gameState, setGameState] = useState(GameState.ENTER_NAME);
  const [playerNames, setPlayerNames] = useState<Array<string>>([]);
  const [pickedNumbers, setPickedNumbers] = useState<Array<number>>([]);
  const [playerMap, setPlayerMap] = useState(new Map<string, Player>());
  const [chit, setChit] = useState<Chit>(new Chit());

  const shouldShowNameContainer = () => {
    return gameState === GameState.ENTER_NAME;
  };

  const onOpponentEvent = (playerId: string, player: Player) => {
    const updatedPlayers = new Map(playerMap);
    updatedPlayers.set(playerId, player);
    setPlayerMap((old) => old.set(playerId, player));
    props.opponentsUpdate(updatedPlayers);
  };

  const onNameEnter = (name: string) => {
    setName(name);
    const isNameSet: boolean = name.trim().length > 0;
    const isRoomSet: boolean = roomId.trim().length > 0;
    if (isNameSet && isRoomSet) {
      onCreateRoom(false, name, roomId);
    } else if (isNameSet) {
      setGameState(GameState.CREATE_OR_JOIN);
    }
  };

  useEffect(() => {
    let roomId = queryString.parse(window.location.search)['roomId']?.toString() || '';
    setRoomId(roomId);
  }, []);

  const shouldShowCreateOptionContainer = () => {
    return gameState === GameState.CREATE_OR_JOIN;
  };

  const onPlayerChange = (player: Player) => {
    setChit(player.chit);
  };

  const shouldShowWaitingToJoinContainer = () => {
    return gameState === GameState.WAITING_TO_START;
  };
  const shouldShowPlayerArea = () => {
    return gameState === GameState.PLAYING;
  };

  const onStart = () => {
    ColyseusConnector.start();

  };

  const onGameStart = () => {
    setGameState(GameState.PLAYING);
  };

  const onNewPlayerAdd = (playerName: string) => {
    setPlayerNames(playerNames => [...playerNames, playerName]);
  };

  const onTurnChange = (isPlayerTurn: boolean, numberMessage: string, nextPlayerName: string) => {
    setIsMyTurn(isPlayerTurn);
    setNextPlayerName(nextPlayerName);
    if (numberMessage.trim().length > 0) {
      message.info(numberMessage);
    }
  };

  const onCreateRoom = (isHost: boolean, name: string, roomId?: string) => {
    setIsHost(isHost);
    setGameState(GameState.WAITING_TO_START);
    ColyseusConnector.joinNew(name, setRoomId, roomId);
    ColyseusConnector.setNewPlayerListener(onNewPlayerAdd);
    ColyseusConnector.setNumberPickListener((num) => {
      setPickedNumbers((old) => [...old, num])
    });
    ColyseusConnector.setPlayerListener(onPlayerChange);
    ColyseusConnector.setGameStartListener(onGameStart);
    ColyseusConnector.setTurnChangeListener(onTurnChange);
    ColyseusConnector.setOpponentChangeListener(onOpponentEvent);
  };

  const onNumberPick = (num: number) => {
    ColyseusConnector.sendNumber(num);
  };

  return (<Row>
    <NameContainer visible={shouldShowNameContainer()}
                   onNameEnter={onNameEnter}/>
    <RoomCreateOptionContainer visible={shouldShowCreateOptionContainer()}
                               name={name}
                               onCreateRoom={onCreateRoom}/>
    <WaitingToJoinContainer onStart={onStart}
                            visible={shouldShowWaitingToJoinContainer()}
                            roomId={roomId}
                            playerNames={playerNames}
                            isHost={isHost}/>
    <PlayerArea chit={chit}
                pickedNumbers={pickedNumbers}
                nextPlayerName={nextPlayerName}
                isPlayerTurn={isPlayerTurn}
                visible={shouldShowPlayerArea()}
                onNumberPick={onNumberPick}/>
  </Row>);
};