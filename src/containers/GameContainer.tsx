import React, {useEffect, useState} from "react";
import {NameContainer} from "./NameContainer";
import {Row} from "antd";
import {RoomCreateOptionContainer} from "./RoomCreateOptionContainer";
import {GameState} from "./GameState";
import * as queryString from 'query-string';
import {WaitingToJoinContainer} from "./WaitingToJoinContainer";
import {ColyseusConnector} from "../colyesues/Connector";
import {NumberGrid} from "./NumberGrid";

export const GameContainer = () => {

  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [gameState, setGameState] = useState(GameState.ENTER_NAME);
  const [playerNames, setPlayerNames] = useState<Array<string>>([]);
  const [pickedNumbers, setPickedNumbers] = useState<Array<number>>([]);

  const showNameContainer = () => {
    return gameState === GameState.ENTER_NAME;
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

  const showCreateOptionContainer = () => {
    return gameState === GameState.CREATE_OR_JOIN;
  };

  const showWaitingToJoinContainer = () => {
    return gameState === GameState.WAITING_TO_START;
  };

  const onStart = () => {
    ColyseusConnector.start();
    ColyseusConnector.setNumberPickListener((num) => {
      setPickedNumbers((old) => [...old, num])
    });
  };

  const onNewPlayerAdd = (playerName: string) => {
    setPlayerNames(playerNames => [...playerNames, playerName]);
  };

  const onCreateRoom = (isHost: boolean, name: string, roomId?: string) => {
    setIsHost(isHost);
    setGameState(GameState.WAITING_TO_START);
    ColyseusConnector.joinNew(name, setRoomId, roomId);
    ColyseusConnector.setNewPlayerListener(onNewPlayerAdd);
  };

  const onNumberPick = (num: number) => {
    ColyseusConnector.sendNumber(num);
  };

  return (<Row>
    <NameContainer visible={showNameContainer()} onNameEnter={onNameEnter}/>
    <RoomCreateOptionContainer visible={showCreateOptionContainer()}
                               name={name}
                               onCreateRoom={onCreateRoom}/>
    <WaitingToJoinContainer onStart={onStart} visible={showWaitingToJoinContainer()}
                            roomId={roomId}
                            playerNames={playerNames}
                            isHost={isHost}/>
    <NumberGrid onNumberPick={onNumberPick} selectedNumbers={pickedNumbers}/>
  </Row>);
};