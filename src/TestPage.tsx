import React, {useEffect, useState} from 'react';
import {Button, Input} from "antd";
import {ArraySchema} from "@colyseus/schema";
import {ColyseusConnector} from "./colyesues/Connector";
import {Block, Chit, Player} from "./colyesues/entities";

export const TestPage = () => {

  const [chit, setChit] = useState<Chit>();
  const [name, setName] = useState<string>();
  const [playerId, setPlayerId] = useState<string>();
  const [currentPlayerId, setCurrentPlayerId] = useState<string>();
  const [roomId, setRoomId] = useState<string>();
  const [number, setNumber] = useState<string>("");


  useEffect(() => {
    const onPlayerUpdate = (player: Player) => {
      const updatedChit: Chit = new Chit();
      if (player.chit) {
        updatedChit.firstRow = player.chit.firstRow;
        updatedChit.secondRow = player.chit.secondRow;
        updatedChit.thirdRow = player.chit.thirdRow;
        setChit(updatedChit);
      }
    };
    ColyseusConnector.setPlayerListener(onPlayerUpdate);
    ColyseusConnector.setCurrentPlayerIdListener(setCurrentPlayerId);
  }, []);

  const displayBlock = (block: Block) => {
    return block.checked ? block.value : block.value + "*"
  };

  const displayRow = (row?: ArraySchema<Block>) => {
    return <div style={{display: "flex", flexDirection: "row"}}>
      {row ? row.map(block => <h3 style={{paddingRight: '30px'}}>{displayBlock(block)}</h3>) : null}
    </div>
  };

  return (
      <div>
        <Button onClick={() => {
          if (name) {
            ColyseusConnector.join(name, setPlayerId, roomId);
          }
        }}> Join </Button>
        <Button onClick={() => {
          if (number && playerId === currentPlayerId) {
            ColyseusConnector.send(number);
          } else {
            console.log("Not your turn")
          }
        }}> Send </Button>
        <Input placeholder={'Number'} onChange={(e) => setNumber(e.target.value)}/>
        <Input placeholder={'Name'} onChange={(e) => setName(e.target.value)}/>
        <Input placeholder={'RoomId'} onChange={(e) => setRoomId(e.target.value)}/>
        <h1>{name}</h1>
        {displayRow(chit?.firstRow)}
        {displayRow(chit?.secondRow)}
        {displayRow(chit?.thirdRow)}
      </div>
  );
};

