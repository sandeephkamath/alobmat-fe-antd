import {WonPlayer} from "../colyesues/entities";
import {Card, Space} from "antd";
import React from "react";

export interface GameResultContainerProps {
  visible: boolean;
  wonPlayers: Array<WonPlayer>;
}

export const GameResultContainer = (props: GameResultContainerProps) => {
  return props.visible ? <Card title={'Game Over'}>
    <Space direction={"vertical"}>
      {props.wonPlayers.map(player => <h3>{`${player.position} - ${player.name}`}</h3>)}
    </Space>
  </Card> : null;
};