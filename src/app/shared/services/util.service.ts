import { Injectable, EventEmitter } from '@angular/core';
import { Card } from './../models/card.model';
import * as _und from 'underscore';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  createDeck() {
    const deck =[]
    const signs = ['spade', 'club', 'heart', 'diamond']
    for (let i = 1; i <= 4; i++) {
      
      for (let j = 1; j < 14; j++){
        let val = j.toString()
        if (j > 10){
          if (j == 11)
            val = 'J'
          if (j == 12)
            val = 'Q'
          if (j == 13)
              val = 'K'
        }
        deck.push(new Card(j, val, signs[i-1]))
      }
            
    }
    return deck 
  }

  shuffleDeck(){
    const deck = this.createDeck()
    return _und.shuffle(deck);
  }
        

}
