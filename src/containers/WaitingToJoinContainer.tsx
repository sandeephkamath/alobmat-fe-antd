import React from "react";
import {Button, Card, Space, Spin} from "antd";

export interface WaitingToJoinContainerProps {
  visible: boolean;
  isHost: boolean;
  onStart: VoidFunction;
  playerNames: Array<string>;
  roomId: string;
}

export const WaitingToJoinContainer = (props: WaitingToJoinContainerProps) => {

  const getTitle = () => {
    if (props.isHost) {
      return canStart() ? "Click start" : "Waiting for players to join";
    }
    return "Waiting for host to start the game"
  };
  const getLink = () => {
    return `${window.location.origin}?roomId=${props.roomId}`;
  };

  const canStart = () => {
    return props.playerNames.length > 0;
  };

  const startButton = <Button disabled={!canStart()}
                              onClick={props.onStart}>Start</Button>

  return props.visible ? <Card title={getTitle()} extra={<Spin/>}>
    <Space direction={"vertical"}>
      {props.playerNames.map(name => <p>{name} joined</p>)}
      {props.isHost ? startButton : null}
      {props.roomId ? <a target={'_blank'} href={getLink()}>{getLink()}</a> : null}
    </Space>
  </Card> : null;
};