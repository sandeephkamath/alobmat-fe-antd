import React, {useState} from "react";
import {Button, Card, Input, Row, Space} from "antd";

export interface NameContainerProp {
  visible: boolean;
  onNameEnter: (name: string) => void;
}

export const NameContainer = (props: NameContainerProp) => {

  const [name, setName] = useState('');

  return props.visible ? <Card style={{width: '500px'}}>
        <Space direction={"vertical"}>
          <Row>
            <Input onChange={event => setName(event.target.value)} placeholder={'Name'}/>
          </Row>
          <Row>
            <Button onClick={() => {
              if (name != null && name.trim().length > 0) {
                props.onNameEnter(name);
              }
            }
            }>Enter</Button>
          </Row>
        </Space>
      </Card> :
      null;
};