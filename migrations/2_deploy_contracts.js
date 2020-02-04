var Voting = artifacts.require("./Voting.sol");
module.exports = function(deployer) {
  deployer.deploy(Voting, ['Satoshi', 'Vitalik'], {gas: 6700000});
};
