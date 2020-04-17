import {Layout, Menu} from "antd";
import React from "react";
import 'antd/dist/antd.css';
import {GameContainer} from "./GameContainer";

const {Header, Content, Footer, Sider} = Layout;

export const AppContainer = () => {
  return (
      <React.Fragment>
        <Layout>
          <Header>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
              <Menu.Item>Alobmat</Menu.Item>
            </Menu>
          </Header>
          <Content style={{padding: '0 50px', minHeight: '100vh'}}>
            <GameContainer/>
          </Content>
          <Footer style={{textAlign: 'center'}}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </React.Fragment>
  );
};