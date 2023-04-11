## Nextjs 框架

为了更加熟悉 css，这里没有引入 css 库，基本采用原生 css，常用的 css 框架选用 tailwindss

钱包交互使用的 web3modal，如果重建使用 rainbownme+wagmi 功能更加齐全好用

## 代码结构

- store/wallet-context.js
  与钱包和合约的交互都写入 Context 里面，因为 Context 允许跨层级传递数据，共享全局数据，通过使用 Context，你可以将数据管理和逻辑与 UI 组件分离，使得代码更加模块化和可维护
