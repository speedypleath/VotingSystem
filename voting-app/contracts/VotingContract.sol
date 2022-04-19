pragma solidity ^0.8.0;

contract BallotBox{
  
    uint ElectoralWard; 
    uint VotingSection; 
    uint TimeStampStart; 
    uint TimeStampEnd; 
    uint CandidateA = 0; 
    uint CandidateB = 0; 
    uint BlankVotes = 0; 
    uint NullVotes = 0; 
    uint NumberCandidateA = 1; 
    uint NumberCandidateB = 2; 
    uint NumberBlankVotes = 3; 
    address BallotBoxAddress;
    address RemoteControlAddress;
    uint[] ElectorID; 
    bool AlreadyVoted = false; 
    bool BallotBoxAddressEnable = false;


    
    constructor(uint _ElectoralWard, uint _VotingSection) public  { 
        ElectoralWard = _ElectoralWard;
        VotingSection = _VotingSection;
        BallotBoxAddress = msg.sender;
    }
    
    function StartVoting() public verification1(){ 
    
        TimeStampStart = block.timestamp; 
        
    }

    
    function FirstPrinting() public view verification1() returns(uint zona, uint VotingSection, uint _TimeStampStart, uint _CandidateA, uint _CandidateB, uint _BlankVotes, uint _NullVotes){

        return( ElectoralWard,
                VotingSection,
                TimeStampStart,
                CandidateA,
                CandidateB,
                BlankVotes,
                NullVotes);
        
    }
    
    function EnablePollWorker()public{
        RemoteControlAddress = msg.sender;
    }
 
    
    function InsertElectorID(uint _ElectorID) public verification2 {
       
        for(uint i=0; i < ElectorID.length; i++){ 
            if(_ElectorID == ElectorID[i]){ 
                    AlreadyVoted = true;
            }
        }
        if(AlreadyVoted == false){ 
            ElectorID.push(_ElectorID); 
        }

    }
    
    function EnableElectronicBallotBox() public verification4(){
        BallotBoxAddressEnable = true;
    }

    
    function ToVote(uint voto) public verification3(BallotBoxAddressEnable){
        if(BallotBoxAddressEnable == true){
            if(voto == NumberCandidateA){
                CandidateA++; 
            }
            else if(voto == NumberCandidateB){
                CandidateB++; 
            }
            else if(voto == NumberBlankVotes){
                BlankVotes++; 
            }
            else{
                NullVotes++;
            }
        }
        BallotBoxAddressEnable = false;
    }

    
    function FinishVoting() public verification1(){
        TimeStampEnd = block.timestamp; 
        BallotBoxAddressEnable = false;
    }
    
      
    function LastPrinting() public view verification1() returns(uint zona, uint VotingSection, uint _TimeStampEnd, uint _CandidateA, uint _CandidateB, uint _BlankVotes, uint _NullVotes){ // retorna o resultado da votação naquela BallotBoxAdress

        return( ElectoralWard,
                VotingSection,
                TimeStampStart,
                CandidateA,
                CandidateB,
                BlankVotes,
                NullVotes);
        
    }
    modifier verification1(){
        require(msg.sender == BallotBoxAddress, "This command need come from the electronic Ballot Box Address");
        _;
    }
    modifier verification2(){
        require(msg.sender == RemoteControlAddress, "This command need come from the poll worker Address");
        _;
    }
    modifier verification3(bool status){
        require(msg.sender == BallotBoxAddress, "This command need come from the electronic Ballot Box Address");
        _;
        require(status == true, "The electronic ballot box is disable, because this elector already voted");
        _;
    }
    modifier verification4(){
        require(msg.sender == RemoteControlAddress, "This command need come from the poll worker Address");
        _;
        require(AlreadyVoted == false, "The electronic ballot box is disable, because this elector already voted");
        _;
    } 
}