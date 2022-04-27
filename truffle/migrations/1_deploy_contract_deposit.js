// const Deposit = artifacts.require('./Deposit.sol');
// const Vimpto = artifacts.require('./Vimpto');
// const VimptonianPassport=artifacts.require('./VimptonianPassport.sol');
// const OGPassport=artifacts.require('./OGPassport.sol');
const VimptoWorlds=artifacts.require('./VimptoWorlds.sol')
const path = require('path');
const filePath = path.join(__dirname, '../../.env');
require('dotenv').config({ path: filePath });

// deploy on testnet
// module.exports = async function (deployer) {
//   await deployer.deploy(
//     Vimpto,
//     process.env.Seed_Address,
//     process.env.Private_Address,
//     process.env.IDOLaunchpads_Address,
//     process.env.Public_Address,
//     process.env.Advisory_Address,
//     process.env.Team_Address,
//     process.env.StakingRewards_Address,
//     process.env.FoundationReserve_Address,
//     [`${process.env.partner_1}`, `${process.env.partner_2}`],
//     [
//       `${process.env.partner_1_ReleaseTime}`,
//       `${process.env.partner_2_ReleaseTime}`,
//     ]
//   );
//   await Vimpto.deployed();
// };
// deploy on localhost

// module.exports = async function (deployer) {
//   await deployer.deploy(Vimpto);
//   const vim = await Vimpto.deployed();
//   await deployer.deploy(Deposit, vim.address);
//   await Deposit.deployed();
// };

//for VimptonianPassport
// module.exports = async function (deployer) {
//   await deployer.deploy(VimptonianPassport);
//   await VimptonianPassport.deployed();
// };


//for OGPassport
// module.exports = async function (deployer) {
//   await deployer.deploy(OGPassport);
//   await OGPassport.deployed();
// };

//for VimptoWorlds
module.exports = async function (deployer) {
  await deployer.deploy(VimptoWorlds,"0xC29cB80eF9A7267b5D971475e01555d561F0B030");
  await VimptoWorlds.deployed();
};