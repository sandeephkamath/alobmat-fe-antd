import {Chit} from "../colyesues/entities";
import {Card, Space} from "antd";
import React from "react";
import {ChitContainer} from "./ChitContainer";
import {NumberGrid} from "./NumberGrid";

export interface PlayerAreaProps {
  chit: Chit;
  pickedNumbers: Array<number>;
  visible: boolean;
  nextPlayerName: string;
  onNumberPick: (num: number) => void;
  isPlayerTurn: boolean;
}

export const PlayerArea = (props: PlayerAreaProps) => {
  return props.visible ? <Card>
    <Space direction={"vertical"}>
      <ChitContainer
          title={props.isPlayerTurn ? 'Your Turn' : `Waiting for ${props.nextPlayerName}`}
          chit={props.chit}/>
      <NumberGrid isPlayerTurn={props.isPlayerTurn}
                  selectedNumbers={props.pickedNumbers}
                  onNumberPick={props.onNumberPick}/>
    </Space>
  </Card> : null;
};