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
    row.forEach((block: Block) => {
      if (block && block.checked) {
        let quotient = block.value / 10;
        const index = quotient % 1 === 0 ? quotient - 1 : Math.floor(quotient);
        values[index] = block.value.toString();
      }
    });
    return <Space>{values.map(value => <Button
        style={{width: '30px', padding: '5px'}}>{value}</Button>)}</Space>;
  };
  const chit = props.chit;

  return (<Space direction={"vertical"}>
    <h3>{props.title}</h3>
    {getRowValues(chit.firstRow)}
    {getRowValues(chit.secondRow)}
    {getRowValues(chit.thirdRow)}
  </Space>);
};