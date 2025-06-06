# WebSocket客户端

这是一个基于Node.js的WebSocket客户端程序，可以连接到指定的WebSocket服务器，并能够发送API请求。

## 功能特点

- 连接到WebSocket服务器 (ws://117.72.118.144:3011)
- 接收WebSocket消息并解析
- 根据接收到的指令发送API请求
- 将API响应结果发送回WebSocket服务器
- 自动重连机制

## 安装

本项目使用yarn作为包管理工具。请确保您已安装Node.js和yarn。

```bash
# 安装依赖
yarn install
```

## 使用方法

```bash
# 启动客户端
yarn start
```

## 消息格式

客户端可以接收以下格式的JSON消息来触发API请求：

```json
{
  "type": "api_request",
  "url": "https://api.example.com/data",
  "method": "GET",
  "data": {"param1": "value1"},
  "headers": {"Authorization": "Bearer token"}
}
```

## API响应

客户端会将API响应以以下格式发送回WebSocket服务器：

```json
{
  "type": "api_response",
  "url": "https://api.example.com/data",
  "status": 200,
  "data": {"result": "success"}
}
```

如果API请求失败，则会发送错误信息：

```json
{
  "type": "api_error",
  "url": "https://api.example.com/data",
  "error": "Request failed with status code 404"
}
```