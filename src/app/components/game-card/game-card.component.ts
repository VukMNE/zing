import { Component, Input, OnInit } from '@angular/core';
import { Card } from '../../shared/models/card.model';
import { GameService } from '../../shared/services/game.service';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.css']
})
export class GameCardComponent implements OnInit {
  @Input('card') card: Card;
  @Input('whose') whose: string; // Can have following values: 'my', 'opponent', 'table' It just tells us how to display it regarding the size
  @Input('index') index: number;
  @Input('score') score: number;
  visited = false;
  isPlayed = false;


  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.computerPlaysACard.subscribe((card: Card) => {
      if(card.number == this.card.number && card.sign == this.card.sign) {
        this.whose = 'in-process'

      }
    })
  }

  getImageName() {
    let n = this.card.number;

    if(n>10) {
      n = n + 1;
    }

    let s = 0
    if(this.card.sign === 'heart')
        s =  0;
    if(this.card.sign === 'diamond')
        s = 1;
    if(this.card.sign === 'club')
        s = 2;
    if(this.card.sign === 'spade')
        s = 3

    return n + '-' + s + '.jpg'
  }

  getDegree() {
    let deg = 0;
    if(this.whose == 'my' ||this.whose == 'opponent') {
      return '0deg'
    }
    else {
      deg = ((this.index - 1) % 12) * 30
      return deg + 'deg';
    }
  }

  onMouseOver() {
    if(this.whose == 'my') {
      this.visited = true
    }
  }

  onMouseLeave() {
    this.visited = false;
  }

  playTheCard() {
    this.isPlayed = true;
    this.gameService.cardIsPlayed.emit({card: this.card, index: this.index});
    setTimeout(() => {
      this.isPlayed = false;
    }, 1200);
  }

}
