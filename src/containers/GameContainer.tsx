import React, {useEffect, useState} from "react";
import {NameContainer} from "./NameContainer";
import {Row} from "antd";
import {RoomCreateOptionContainer} from "./RoomCreateOptionContainer";
import {GameState} from "./GameState";
import * as queryString from 'query-string';
import {WaitingToJoinContainer} from "./WaitingToJoinContainer";
import {ColyseusConnector} from "../colyesues/Connector";

export const GameContainer = () => {

  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [gameState, setGameState] = useState(GameState.ENTER_NAME);
  const [playerNames, setPlayerNames] = useState<Array<string>>([]);

  const showNameContainer = () => {
    return gameState === GameState.ENTER_NAME;
  };

  useEffect(() => {
    const isNameSet: boolean = name.trim().length > 0;
    const isRoomSet: boolean = roomId.trim().length > 0;
    if (isNameSet && isRoomSet) {
      setGameState(GameState.WAITING_TO_START);
    } else if (isNameSet) {
      setGameState(GameState.CREATE_OR_JOIN);
    }
  }, [name, roomId]);

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
  };

  const onNewPlayerAdd = (playerName: string) => {
    setPlayerNames(playerNames => [...playerNames, playerName]);
  };

  const onCreateRoom = (roomId?: string) => {
    setIsHost(!roomId);
    setGameState(GameState.WAITING_TO_START);
    ColyseusConnector.joinNew(name, roomId);
    ColyseusConnector.setNewPlayerListener(onNewPlayerAdd);
  };

  return (<Row>
    <NameContainer visible={showNameContainer()} onNameEnter={setName}/>
    <RoomCreateOptionContainer visible={showCreateOptionContainer()}
                               onCreateRoom={onCreateRoom}/>
    <WaitingToJoinContainer onStart={onStart} visible={showWaitingToJoinContainer()}
                            playerNames={playerNames}
                            isHost={isHost}/>
  </Row>);
};