import {Button, Row, Space} from "antd";
import React from "react";
import {range} from "../util/Util";

export interface NumberGridProps {
  selectedNumbers: Array<number>;
  onNumberPick: (num: number) => void;
}

export const NumberGrid = (props: NumberGridProps) => {

  const getNumberButton = (num: number) => {
    return (<Button disabled={props.selectedNumbers.indexOf(num) > -1}
                    value={num}
                    onClick={() => props.onNumberPick(num)}
                    style={{width: '80px'}}>{num}</Button>);
  };

  const getRow = (start: number, end: number) => {
    return <Space>{range(start, end).map(num => getNumberButton(num))}</Space>;
  };

  return <div>{range(0.1, 10).map(num => <Row
      style={{marginBottom: '10px'}}>{getRow(num * 10, num * 10 + 10)}</Row>)}</div>;
};