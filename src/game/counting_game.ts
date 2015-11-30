/// <reference path="../lib/types.d.ts" />
import {
  FORM_DIRECTIVES,
  Component,
  NgFor,
  NgIf,
  View,
  ViewEncapsulation
} from 'angular2/angular2';
import { FirebaseService } from '../lib/firebase';
import { capitalize, pluralize } from '../lib/lib';
declare var Rx;

@Component({
  selector: 'counting-game'
})
@View({
  directives: [FORM_DIRECTIVES, NgFor, NgIf],
  templateUrl: 'src/game/counting_game.html',
  encapsulation: ViewEncapsulation.None
})
export class CountingGameComponent {
  static CHILD: string = 'counting';
  questions: GameQ[] = [];
  questionNumber: number = -1;
  currentQ: GameQ = null;
  finished: boolean = true;
  total: number = 0;
  score: number = 0;
  nextScore: number = 0;
  addScore: boolean = false;
  
  constructor(public firebase: FirebaseService) {
    this.firebase.readChild(CountingGameComponent.CHILD)
      .flatMap((qs: CountingQ[]) => {
        var counter: number = 0;
        return Rx.Observable.from(qs)
          .map((q: CountingQ) => {
            return Object.keys(q)
              .map((animal: string) => q[animal])
              .sort((left: AnimalCount, right: AnimalCount) => left.createdAt - right.createdAt);
          })
          .map((animals: AnimalCount[]) => {
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
          this.finished = false;
        } else {
          this.questions = [];
          this.questionNumber = -1;
          this.currentQ = null;
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
  }
  
  onSubmit(value: any): void {
    var total: number = this.currentQ.animals.length;
    var score: number = 0;
    this.currentQ.animals.forEach((animal: AnimalCount) => {
      if (value[animal.name] == animal.count) {
        score++;
      }
    });
    this.addScore = true;
    this.total += total;
    this.nextScore = score;
  }
  
  questionContent(): string {
    var animals: AnimalCount[] = [];
    this.currentQ.animals.forEach((animal: AnimalCount) => {
      if (animal.flag) {
        animals.push(animal);
      }
    });
    if (animals.length < 1) {
      return '';
    }
    var result: string = pluralize(animals[0].name);
    if (animals.length == 1) {
      return result;
    }
    if (animals.length == 2) {
      return result + ` and ${ pluralize(animals[animals.length-1].name) }`;
    }
    for (var i: number = 1; i < animals.length-1; i++) {
      result += `, ${ pluralize(animals[i].name) }`;
    }
    result += `, and ${ pluralize(animals[animals.length-1].name) }`;
    return result;
  }
  
  spaces(name: string): string[] {
    var count: number = 0;
    this.currentQ.animals.forEach((animal: AnimalCount) => {
      if (animal.name.length > count) {
        count = animal.name.length;
      }
    });
    var arr: string[] = [];
    for (var i: number = name.length; i <= count; i++) {
      arr.push('&nbsp;');
    }
    return arr;
  }
}