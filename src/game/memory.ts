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
  selected: { id: number, name: string } = { id: -1, name: '' };
  matches: { [name: string]: boolean } = {};
  matched: number = 0;
  finished: boolean = false;
  total: number = 0;
  score: number = 0;
  nextScore: number = 0;
  addScore: boolean = false;
  
  constructor() {
    this.questions = this.loadQuestions();
    this.currentQ = this.questions[0];
    this.matches = this.setupMatches();
  }
  
  capitalize(name: string): string {
    return capitalize(name);
  }
  
  calculateOffset(): number {
    return Math.floor((12 - this.currentQ.animals[0].length) / 2);
  }
  
  hasQuestions(): boolean {
    return this.questions.length > 0;
  }
  
  isMatched(name: string): boolean {
    return this.matches[name];
  }
  
  loadQuestions(): GameQ[] {
    var questions: GameQ[] = [];
    var count: number = 2;
    var id: number = 0;
    for (var i: number = 1; i <= 10; i++) {
      var animals: { id: number, name: string }[] = [];
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
      var arrangement: { id: number, name: string }[][] = [];
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
    this.selected = { id: -1, name: '' };
    this.matched = 0;
    this.questionNumber++;
    if (this.questionNumber > this.questions.length) {
      this.finished = true;
      return;
    }
    this.currentQ = this.questions[this.questionNumber-1];
    this.matches = this.setupMatches();
  }
  
  select(id: number, name: string): void {
    if (this.selected.name == name) {
      this.matches[name] = true;
      this.matched++;
    }
    if (this.matched == this.currentQ.animals[0].length) {
      this.showScore();
    } else {
      this.selected = { id: id, name: name };
    }
  }
  
  setupMatches(): { [name: string]: boolean } {
    var matches: { [name: string]: boolean } = {};
    this.currentQ.animals.forEach((animals: { id: number, name: string }[]) => {
      animals.forEach((animal: { id: number, name: string }) => {
        matches[animal.name] = false;
      });
    });
    return matches;
  }
  
  showScore(): void {
    this.addScore = true;
    this.total += this.currentQ.animals[0].length;
    this.nextScore = this.currentQ.animals[0].length;
  }
}