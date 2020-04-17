import React from "react";
import {Button, Card, Space, Spin} from "antd";

export interface WaitingToJoinContainerProps {
  visible: boolean;
  isHost: boolean;
  onStart: VoidFunction;
  playerNames: Array<string>
}

export const WaitingToJoinContainer = (props: WaitingToJoinContainerProps) => {

  const getTitle = () => {
    return props.isHost ? "Click start" : "Waiting for host to start the game"
  };

  const startButton = <Button onClick={props.onStart}>Start </Button>

  return props.visible ? <Card title={getTitle()} extra={<Spin/>}>
    <Space direction={"vertical"}>
      {props.playerNames.map(name => <p>{name} joined</p>)}
      {props.isHost ? startButton : null}
    </Space>
  </Card> : null;
};