// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import voting_artifacts from '../../build/contracts/Voting.json'

var Voting = contract(voting_artifacts);

let candidates = {"Satoshi": "candidate-1", "Vitalik": "candidate-2"}

// Function to vote a candidate passed as parameter.
// Once the transaction is mined, the counter is updated
window.vote = function(candidate) {
  let candidateName = $("#candidate").val();
  try {
    $("#msg").html("Your vote has been emitted. The number of votes will be updated when the transaction is mined. Please wait");
    $("#candidate").val("");

    Voting.deployed().then(function(contractInstance) {
      contractInstance.vote(candidateName, {gas: 140000, from: web3.eth.accounts[0]}).then(function() {
        let div_id = candidates[candidateName];
        return contractInstance.totalVotes.call(candidateName).then(function(v) {
          $("#" + div_id).html(v.toString());
          $("#msg").html("");
        });
      });
    });
  } catch (err) {
    console.log(err);
  }
}

// When the page loads, the conection with the blockchain starts and the votes of candidates are updated
$( document ).ready(function() {
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 of external source as Metamask")
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("Web3 not detected. Redirect to http://localhost:7545");
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"));
  }

  Voting.setProvider(web3.currentProvider);
  let candidatesName = Object.keys(candidates);

  for (var i = 0; i < candidatesName.length; i++) {
    let name = candidatesName[i];
    Voting.deployed().then(function(contractInstance) {
      contractInstance.totalVotes.call(name).then(function(v) {

        $("#" + candidatos[name]).html(v.toString());
      });
    })
  }
});