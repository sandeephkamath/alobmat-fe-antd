import React, {useEffect, useState} from "react";
import {NameContainer} from "./NameContainer";
import {Row} from "antd";
import {RoomCreateOptionContainer} from "./RoomCreateOptionContainer";
import {GameState} from "./GameState";
import {WaitingToJoinContainer} from "./WaitingToJoinContainer";
import {ColyseusConnector} from "../colyesues/Connector";

export const GameContainer = () => {

  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [gameState, setGameState] = useState(GameState.ENTER_NAME);

  const showNameContainer = () => {
    return gameState === GameState.ENTER_NAME;
  };

  useEffect(() => {
    if (name.trim().length > 0) {
      setGameState(GameState.CREATE_OR_JOIN);
    }
  }, [name]);

  const showCreateOptionContainer = () => {
    return gameState === GameState.CREATE_OR_JOIN;
  };

  const showWaitingToJoinContainer = () => {
    return gameState === GameState.WAITING_TO_START;
  };

  const onStart = () => {
    ColyseusConnector.start();
  };

  const onCreateRoom = (roomId?: string) => {
    setIsHost(!roomId);
    setRoomId(roomId ? roomId : '');
    setGameState(GameState.WAITING_TO_START);
    ColyseusConnector.joinNew(name, roomId);
  };

  return (<Row>
    <NameContainer visible={showNameContainer()} onNameEnter={setName}/>
    <RoomCreateOptionContainer visible={showCreateOptionContainer()}
                               onCreateRoom={onCreateRoom}/>
    <WaitingToJoinContainer onStart={onStart} visible={showWaitingToJoinContainer()}
                            isHost={isHost}/>
  </Row>);
};