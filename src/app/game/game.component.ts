import { Component, OnInit } from '@angular/core';
import { Card } from '../shared/models/card.model';
import { UtilService } from '../shared/services/util.service';
import { GameService } from '../shared/services/game.service';
import { ActivatedRoute } from '@angular/router'
import { DataService } from '../shared/services/data.service';
import Swal from 'sweetalert2'
import { Observable } from 'rxjs';



@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  deck = Array<Card>();
  cardsOnTable = Array<Card>();
  myCards = Array<Card>();
  opponentCards = Array<Card>();
  myTakenCards = Array<Card>();
  opponentTakenCards = Array<Card>();
  aiAgent: string;
  myPoints = 0;
  oppPoints = 0;
  iTook = false;
  comTook = false;
  gameStarted = false;
  myScores: any;
  oppScores: any;

  constructor(private utilService: UtilService,
              private gameService: GameService,
              private dataService: DataService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.aiAgent = this.route.snapshot.url[1].path;
    this.gameService.cardIsPlayed.subscribe(async (cardEvent) => {
      await setTimeout(async () => {
        let cardThrown = this.myCards.splice(cardEvent.index - 1, 1)
        this.cardsOnTable = this.cardsOnTable.concat(cardThrown);
        return await this.mePlays();
      }, 1001);

      await setTimeout(async () => {
        return await this.opponentChoosesCard();
      }, 1100);





    
    })
  }

  startGame() {
    this.myTakenCards = Array<Card>();
    this.opponentTakenCards = Array<Card>();
    if(this.gameStarted == false) {
      this.gameStarted = true;
    }
    this.deck = this.utilService.shuffleDeck();
    // console.log(this.deck.slice());
    for(let i = 1; i <= 4; i++) {
      this.cardsOnTable.push(this.deck[0]);
      this.deck.shift();
    }

    this.dealCards(1)

  }

  dealCards(firstIs) {
    // console.log('Evo me');
    if(this.deck.length == 0) {
      if(this.myPoints >= 101 || this.oppPoints >= 101) {
        Swal.fire('Game ended');
      } else {
        Swal.fire('Round ended');
        this.startGame();
      }
    } else {
      if(firstIs == 1) {
        for(let i = 1; i <= 4; i++) {
          this.myCards.push(this.deck[0]);
          this.deck.shift();
        }

        this.sendMyCardsToServer();

        for(let i = 1; i <= 4; i++) {
          this.opponentCards.push(this.deck[0]);
          this.deck.shift();
        }
      } else {
        for(let i = 1; i <= 4; i++) {
          this.opponentCards.push(this.deck[0]);
          this.deck.shift();
        }

        for(let i = 1; i <= 4; i++) {
          this.myCards.push(this.deck[0]);
          this.deck.shift();
        }

      }
    }
  }

  async opponentPlaysGivenCard(cardIndex) {
    this.gameService.computerPlaysACard.emit(this.opponentCards[cardIndex]);
    return await setTimeout(() => {
      let cardThrown = this.opponentCards.splice(cardIndex, 1)
      this.cardsOnTable = this.cardsOnTable.concat(cardThrown)
      return this.solveMove(2);
    }, 1001);


  }

  async opponentChoosesCard() {
    if(this.aiAgent == 'random') {
      let choiceOfTheCard = this.randomChoice(this.opponentCards);
      return await this.opponentPlaysGivenCard(choiceOfTheCard);
    } else {
      this.sendOppCardsToServer(this.aiAgent).subscribe((scores) => {
        this.opponentPlaysGivenCard(this.argmax(scores))
      })
    }
  }

  randomChoice(cards) {
    return Math.floor(Math.random() * cards.length)
  }

  async mePlays() {
    this.solveMove(1);
  }

  solveMove(whoseMove) {
    // console.log(whoseMove == 1 ? 'moj potez' : 'njegov potez');
    // console.log(this.cardsOnTable);
    // console.log('-------')
    if(this.cardsOnTable.length < 2) {
      if(whoseMove == 2) {
        this.sendMyCardsToServer();
      }
    }

    if(this.cardsOnTable[this.cardsOnTable.length - 2].number === this.cardsOnTable[this.cardsOnTable.length - 1].number){
      // collect cards and transfer points
      // console.log('IDEEE')
      this.collectCardsAndPoints(whoseMove)
    } else if(this.cardsOnTable[this.cardsOnTable.length - 1].value == 'J') {
      // collect cards and transfer points
      // console.log('ALOOOOOOOOOOOOO')
      this.collectCardsAndPoints(whoseMove)
    } else {
      this.sendMyCardsToServer();
    }


    if(this.myCards.length == 0 && this.opponentCards.length == 0) {
      this.dealCards(1);
    }



  }

  collectCardsAndPoints(whoseMove) {
    if (this.cardsOnTable.length == 2) {
      // check if it is a zing, check if both cards have the same value
      if (this.cardsOnTable[0].number == this.cardsOnTable[1].number) {
        // it is a zing
        let zing_points = 10
        Swal.fire('Zzzzzzzzzzzzing');
        if (this.cardsOnTable[1].value == 'J') {
          zing_points = 20
        }

        if(whoseMove == 1) {
          this.myPoints += zing_points
          this.collectionTookPlace(whoseMove);
        } else {
          this.oppPoints += zing_points
          this.collectionTookPlace(whoseMove);
        }
      }
          
    }


    if(this.cardsOnTable[this.cardsOnTable.length - 2].number == this.cardsOnTable[this.cardsOnTable.length - 1].number || 
      this.cardsOnTable[this.cardsOnTable.length - 1].value == 'J') {
        this.collectionTookPlace(whoseMove)
      }

    
    
  }

  async collectionTookPlace(whoseMove) {
    let cardsShouldBeDealt = false;
    if(whoseMove == 1) {
      this.myTakenCards = this.myTakenCards.concat(this.cardsOnTable);
      this.myPoints += this.countPointsFromCards(this.cardsOnTable);
      this.iTook = true;
      return await setTimeout(() => {
        this.cardsOnTable = [];
        this.iTook = false;
        if(this.myCards.length == 0 && this.opponentCards.length == 0) {
          this.dealCards(1);
        } else {
          this.sendMyCardsToServer();
        }
      }, 1000);
    } else {
      this.opponentTakenCards = this.myTakenCards.concat(this.cardsOnTable);
      this.oppPoints += this.countPointsFromCards(this.cardsOnTable);
      this.comTook = true;
      return await setTimeout(() => {
        this.cardsOnTable = [];
        this.comTook = false;
        if(this.myCards.length == 0 && this.opponentCards.length == 0) {
          this.dealCards(1);
        } else {
          this.sendMyCardsToServer();
        }
      }, 1000);
    }
  }


  countPointsFromCards(cards: Array<Card>){
    let pts = 0;
    let i = 0;
    cards.forEach((card) => {
      if(card.number == 1) {
        pts += 1;
      }

      if (card.number >= 10 || (card.number == 2 && card.sign == 'club')){
        pts += 1
        if (card.number == 10 && card.sign == 'diamond'){
          pts += 1
        }
      }
    })
    

    return pts
  }

  async sendMyCardsToServer() {
    const obj = {
      my_cards: this.myCards,
      cards_on_table: this.cardsOnTable,
      cards_already_played: this.myTakenCards.concat(this.opponentTakenCards),
      deck: this.deck
    }
    console.log(obj)
    return this.dataService.postAnyData('heuristic', obj).subscribe((data) => {
      console.log('Stigli podaci');
      console.log(data);
      this.myScores = data;
      return data;
    });

  }

  sendOppCardsToServer(url): Observable<any> {
    const obj = {
      my_cards: this.opponentCards,
      opp_cards: this.opponentCards,
      cards_on_table: this.cardsOnTable,
      cards_already_played: this.myTakenCards.concat(this.opponentTakenCards),
      deck: this.deck
    }
    return this.dataService.postAnyData(url, obj)

  }

  argmax(arr) {
    let max = -1;
    let ind_max = 0;
    for(let i = 0; i < arr.length; i++) {
      if(arr[i] > max) {
        max = arr[i]
        ind_max = i;
      }
    }

    return ind_max;

  }

}
