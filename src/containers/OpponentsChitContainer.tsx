import React from "react";
import {Player} from "../colyesues/entities";
import {Space} from "antd";
import {ChitContainer} from "./ChitContainer";

export interface OpponentsChitContainerProps {
  opponentsMap: Map<string, Player>;
}

export const OpponentsChitContainer = (props: OpponentsChitContainerProps) => {

  return <Space style={{paddingLeft: '20px'}}
                direction={"vertical"}>{Array.from(props.opponentsMap.values()).map(player => {
    return <Space direction={"vertical"}>
      <ChitContainer chit={player.chit} title={player.name}/>
    </Space>
  })}</Space>
};