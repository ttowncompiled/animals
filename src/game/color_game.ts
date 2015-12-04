/// <reference path="../lib/types.d.ts" />
import {
  FORM_DIRECTIVES,
  Component,
  NgFor,
  NgIf,
  NgStyle,
  View,
  ViewEncapsulation
} from 'angular2/angular2';
import { FirebaseService } from '../lib/firebase';
import { COLORS, Pic, capitalize, pluralize, shuffle } from '../lib/lib';
declare var Rx;

@Component({
  selector: 'color-game'
})
@View({
  directives: [FORM_DIRECTIVES, NgFor, NgIf, NgStyle],
  templateUrl: 'src/game/color_game.html',
  encapsulation: ViewEncapsulation.None
})
export class ColorGameComponent {
  static CHILD: string = 'color';
  questions: GameQ[] = [];
  questionNumber: number = -1;
  currentQ: GameQ = null;
  colors: string[][] = [];
  selected: string = '';
  finished: boolean = true;
  total: number = 0;
  score: number = 0;
  nextScore: number = 0;
  addScore: boolean = false;
  
  constructor(public firebase: FirebaseService) {
    this.firebase.readChild(ColorGameComponent.CHILD)
      .flatMap((qs: ColorQ[]) => {
        var counter: number = 0;
        return Rx.Observable.from(qs)
          .map((q: ColorQ) => {
            return Object.keys(q)
              .map((animal: string) => q[animal])
              .sort((left: AnimalColor, right: AnimalColor) => left.createdAt - right.createdAt);
          })
          .map((animals: AnimalColor[]) => {
            counter++;
            return { value: counter, animals: animals }
          })
          .toArray();
      })
      .subscribeOnNext((questions: GameQ[]) => {
        if (questions != null) {
          this.questions = questions;
          this.questionNumber = 1;
          this.currentQ = this.questions[0];
          this.colors = this.loadColors();
          this.finished = false;
        } else {
          this.questions = [];
          this.questionNumber = -1;
          this.currentQ = null;
          this.colors = [];
          this.finished = true;
        }
      });
  }
  
  capitalize(name: string): string {
    return capitalize(name);
  }
  
  hasQuestions(): boolean {
    return this.questions.length > 0;
  }
  
  loadColors(): string[][] {
    var result: string[] = [];
    var colors: string[] = Object.keys(COLORS);
    result.push(COLORS[this.currentQ.animals[0].color]);
    colors.splice(colors.indexOf(this.currentQ.animals[0].color), 1);
    for (var i: number = 0; i < 7; i++) {
      var idx: number = Math.floor(Math.random() * colors.length);
      result.push(COLORS[colors[idx]]);
      colors.splice(idx, 1);
    }
    result = shuffle(result);
    var arrangement: string[][] = [];
    arrangement.push(result.slice(0, result.length / 2));
    arrangement.push(result.slice(result.length / 2, result.length));
    return arrangement;
  }
  
  nextQuestion(): void {
    this.score += this.nextScore;
    this.nextScore = 0;
    this.addScore = false;
    this.questionNumber++;
    if (this.questionNumber > this.questions.length) {
      this.finished = true;
      return;
    }
    this.currentQ = this.questions[this.questionNumber-1];
    this.colors = this.loadColors();
    this.selected = '';
  }
  
  onSubmit(value: any): void {
    var total: number = this.currentQ.animals.length;
    var score: number = 0;
    this.currentQ.animals.forEach((animal: AnimalWhat) => {
      if (this.selected == COLORS[this.currentQ.animals[0].color]) {
        score++;
      }
    });
    this.addScore = true;
    this.total += total;
    this.nextScore = score;
  }
  
  select(color: string): void {
    this.selected = color;
  }
}