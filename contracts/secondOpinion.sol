pragma solidity ^0.5.0;

/**
    * Example script for the Ethereum development walkthrough
    Source URL: 
    https://github.com/devzl/ethereum-walkthrough-1/blob/master/Wrestling.sol
    */

contract secondOpinion {
    /**
    * Our lawyers
    */
	address public lawyer1;
	address public lawyer2;

	bool public lawyer1assessed;
	bool public lawyer2assessed;

	uint private lawyer1Assessment;
	uint private lawyer2Assessment;

	bool public assessmentFinished;
    address public theWinner;
    uint gains;

    /**
    * The logs that will be emitted in every step of the contract's life cycle
    */
	event AssessmentStartsEvent(address lawyer1, address lawyer2);
	event EndOfRoundEvent(uint lawyer1Assessment, uint lawyer2Assessment);
	event assessmentFinishedEvent (address winner, uint gains);

    /**
    * The contract constructor
    */
	constructor() public {
		lawyer1 = msg.sender;
	}

    /**
    * A second lawyer can register as an opponent
    */
	function registerAsAnOpponent() public {
        require(lawyer2 == address(0));

        lawyer2 = msg.sender;

        emit AssessmentStartsEvent(lawyer1, lawyer2);
    }

    /**
    * Every round a lawyer can put a sum of ether, if one of the lawyers put in twice or
    * less the money (in total) than the other did, the first wins
    */
    function assess() public payable {
    	require(!assessmentFinished && (msg.sender == lawyer1 || msg.sender == lawyer2));

    	if(msg.sender == lawyer1) {
    		require(lawyer1assessed == false);
    		lawyer1assessed = true;
    		lawyer1Assessment = lawyer1Assessment + msg.value;
    	} else if (msg.sender == lawyer2){
    		require(lawyer2assessed == false);
    		lawyer2assessed = true;
    		lawyer2Assessment = lawyer2Assessment + msg.value;
    	} 

    	if(lawyer1assessed && lawyer2assessed) {
    		if(lawyer1Assessment >= lawyer2Assessment) {
                endOfAssessment(lawyer2);
    		} else {
                endOfRound();
            }
    	}
    }

    function endOfRound() internal {
    	lawyer1assessed = false;
    	lawyer2assessed = false;

    	emit EndOfRoundEvent(lawyer1Assessment, lawyer2Assessment);
    }

    function endOfAssessment(address winner) internal {
        assessmentFinished = true;
        theWinner = winner;

        gains = lawyer1Assessment + lawyer2Assessment;
        emit assessmentFinishedEvent (winner, gains);
    }

    /**
    * The withdraw function, following the withdraw pattern shown and explained here:
    * http://solidity.readthedocs.io/en/develop/common-patterns.html#withdrawal-from-contracts
    */
    function withdraw() public {
        require(assessmentFinished && theWinner == msg.sender);

        uint amount = gains;

        gains = 0;
        msg.sender.transfer(amount);
    }
}