import {range} from "../util/Util";
import {Button, Space} from "antd";
import React from "react";
import {ArraySchema} from "@colyseus/schema";
import {Block, Chit} from "../colyesues/entities";

export interface ChitContainerProps {
  chit: Chit;
  title: string;
}

export const ChitContainer = (props: ChitContainerProps) => {

  const getRowValues = (row: ArraySchema<Block>) => {
    const values = range(0, 9).map(() => "*");
    row.forEach(block => {
      if (block && block.checked) {
        const index = Math.floor(block.value / 10);
        values[index] = block.value.toString();
      }
    });
    return <Space>{values.map(value => <Button style={{width: '80px'}}>{value}</Button>)}</Space>;
  };
  const chit = props.chit;

  return (<Space direction={"vertical"}>
    <h3>{props.title}</h3>
    {getRowValues(chit.firstRow)}
    {getRowValues(chit.secondRow)}
    {getRowValues(chit.thirdRow)}
  </Space>);
};