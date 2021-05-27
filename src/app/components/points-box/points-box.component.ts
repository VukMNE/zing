import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-points-box',
  templateUrl: './points-box.component.html',
  styleUrls: ['./points-box.component.css']
})
export class PointsBoxComponent implements OnInit {
  @Input('playerName') playerName: string;
  @Input('points') points: number;
  @Input('type') type: number;

  constructor() { }

  ngOnInit(): void {
  }

}
