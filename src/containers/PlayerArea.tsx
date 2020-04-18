import {Chit} from "../colyesues/entities";
import {Card, Space} from "antd";
import React from "react";
import {ChitContainer} from "./ChitContainer";
import {NumberGrid} from "./NumberGrid";

export interface PlayerAreaProps {
  chit: Chit;
  pickedNumbers: Array<number>;
  visible: boolean;
  onNumberPick: (num: number) => void;
}

export const PlayerArea = (props: PlayerAreaProps) => {
  return props.visible ? <Card>
    <Space direction={"vertical"}>
      <ChitContainer chit={props.chit}/>
      <NumberGrid selectedNumbers={props.pickedNumbers} onNumberPick={props.onNumberPick}/>
    </Space>
  </Card> : null;
};