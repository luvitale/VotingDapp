var Voting = artifacts.require("./Voting.sol");

contract('Voting', function(accounts) {


  // Unit test to give a vote to Satoshi.
  // At the end, it must be verified that the number of votes
  // has increased as expected
  it("Vote Satoshi with the account 0", function() {
    var voting;

    var votesBefore, votesAfter;

    return Voting.deployed().then(function(instance) {
      voting = instance;
      return voting.totalVotes.call(web3.utils.asciiToHex("Satoshi"));
    }).then(function(votes) {
      votesBefore = votes.toNumber();
      return voting.vote(web3.utils.asciiToHex("Satoshi"), {from: accounts[0]});
    }).then(function() {
      return voting.totalVotes.call(web3.utils.asciiToHex("Satoshi"));
    }).then(function(votes) {
      votesAfter = votes.toNumber();

      assert.equal(votesBefore + 1, votesAfter, "The number of votes should have increased by 1");
    });
  });

  // Unit test that tries to give a vote to a non-existent candidate.
  // It must throw exception and enter the catch.
  it("Vote invalid candidate", function() {
    var voting;

    var votesBefore, votesAfter;

    return Voting.deployed().then(function(instance) {
      voting = instance;
      return voting.vote(web3.utils.asciiToHex("Jane"), {from: accounts[0]});
    }).then(function() {
      console.debug("It shouldn't get here because it should throw exception")
    });
  });
});