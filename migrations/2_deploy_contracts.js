var Voting = artifacts.require("./Voting.sol");
module.exports = function(deployer) {
  deployer.deploy(Voting, ['Satoshi', 'Vitalik'].map(x => web3.utils.asciiToHex(x)), {gas: 6700000});
};
