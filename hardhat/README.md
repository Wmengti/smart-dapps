## Smart Contract by hardhat

##模块解析
### 白名单
- contracts/WhiteList.sol
设置白名单总数，在没有达到总数的任何时间都可以mint
- deploy/00_deploy_whitelist.js 
白名单部署脚本

### NFT 
- contract/CryptoDev.sol 
可以手动设置开启NFT铸造，并设定铸造的时间范围，中途可以手动停止
只有白名单用户才可以free mint，非白名单用户需要支付一定ETH
- scripts/pause.js
暂停mint的脚本
- scripts/startContract.js
开启铸造，并设定时间
- deploy/01_deploy_cryptodevs.js
NFT部署脚本

### Token 
- contract/CryptoDevToken.sol 
NFT持有的用户，每个NFT都可以mint Token 
非NFT持有的用户，可以参与public mint，需要支付一定的ETH
- deploy/02_deploy_cryptodevtoken.js
ERC20 token部署脚本

### NFT交易市场
- FackNFTMarketPlace.sol 
暂时未使用，有购买，获取价格的功能
- 03_deploy_nftmarketplace.js 
部署脚本

### DAO
- DAO.sol 
功能有NFT持有者创建提案，对提案投票。执行提案的接口
- 04_deploy_dao.js
DAO部署脚本

### 交易
- Exchange.sol
创建ETH-CD交易对，可以增加LP和移除LP，买入和卖出CD token 
- 05_deploy_exchange.js
交易部署脚本


### 辅助脚本
- helper-hardhat-config.js 
常量和存储路径

