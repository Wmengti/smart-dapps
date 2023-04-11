## Nextjs 框架

为了更加熟悉 css，这里没有引入 css 库，基本采用原生 css，常用的 css 框架选用 tailwindss

钱包交互使用的 web3modal，如果重建使用 rainbownme+wagmi 功能更加齐全好用

## 代码结构

- store/wallet-context.js

与钱包和合约的交互都写入 Context 里面，因为 Context 允许跨层级传递数据，共享全局数据，通过使用 Context，你可以将数据管理和逻辑与 UI 组件分离，使得代码更加模块化和可维护

- Hero/WhiteList.js

- NFT/NFTmint.js

  - mint 数量、倒计时
  - 白名单 cliam 和 public mint

- Tokens

  - TokenMint.js
  - LineChart.js/LiquidityTable.js/ToolTip.js LP 的图表，可以交互移动查看当前时间点的 LP 数量
  - AddLiquidity.js/RemoveLiquidity.js/Swap.js 交易 CD、添加 LP 和移除 LP
  -

- DAO

  - Modal.js 链接 mongodb,存储建议或者提案内容
  - DAO.js 主页面
  - DAOvoteDetail.js/DAOvoteItem.js 投票页面/单个投票卡片
  - Form.js 提交建议/提案的页面

- api
  liquitdy/dao 的建议/dao 的提案 从 mongodb 存储和读取

- [...slug].js
  提案的细节界面
