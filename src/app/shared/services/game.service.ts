import { EventEmitter, Injectable } from '@angular/core';
import { Card } from '../models/card.model';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  cardIsPlayed = new EventEmitter<{card: Card, index: number}>();
  computerPlaysACard = new EventEmitter<Card>();
  constructor() { }
}
