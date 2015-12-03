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
import { ANIMALS, Pic, capitalize, pluralize, shuffle } from '../lib/lib';
declare var Rx;

@Component({
  selector: 'memory-game'
})
@View({
  directives: [FORM_DIRECTIVES, NgFor, NgIf, NgStyle],
  templateUrl: 'src/game/memory_game.html',
  encapsulation: ViewEncapsulation.None
})
export class MemoryGameComponent {
  questionNumber: number = 1;
  questions: GameQ[] = [];
  currentQ: GameQ = null;
  selected: number = -1;
  finished: boolean = false;
  score: number = 0;
  nextScore: number = 0;
  addScore: boolean = false;
  
  constructor() {
    this.questions = this.loadQuestions();
    this.currentQ = this.questions[0];
  }
  
  capitalize(name: string): string {
    return capitalize(name);
  }
  
  hasQuestions(): boolean {
    return this.questions.length > 0;
  }
  
  loadQuestions(): GameQ[] {
    var questions: GameQ[] = [];
    var count: number = 2;
    var id: number = 0;
    for (var i: number = 1; i <= 10; i++) {
      var animals: {id: number, name: string}[] = [];
      var names: string[] = ANIMALS.slice();
      for (var j: number = 1; j <= count; j++) {
        var idx: number = Math.floor(Math.random() * names.length);
        animals.push({id: id, name: names[idx]});
        id++;
        animals.push({id: id, name: names[idx]});
        id++;
        names.splice(idx, 1);
      }
      animals = shuffle(animals);
      var arrangement: {id: number, name: string}[][] = [];
      arrangement.push(animals.slice(0, animals.length / 2));
      arrangement.push(animals.slice(animals.length / 2, animals.length));
      if (i % 2 == 0) {
        count++;
      }
      var q: GameQ = { value: i, animals: arrangement };
      questions.push(q);
    }
    return questions;
  }
  
  nextQuestion(): void {
    this.score += this.nextScore;
    this.nextScore = 0;
    this.addScore = false;
    this.selected = -1;
    this.questionNumber++;
    if (this.questionNumber > this.questions.length) {
      this.finished = true;
      return;
    }
    this.currentQ = this.questions[this.questionNumber-1];
  }
  
  select(id: number): void {
    this.selected = id;
  }
}