/// <reference path="../lib/types.d.ts" />
import {
  FORM_DIRECTIVES,
  Component,
  NgFor,
  NgIf,
  NgSwitch,
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
  directives: [FORM_DIRECTIVES, NgFor, NgIf, NgSwitch],
  templateUrl: 'src/game/counting_game.html',
  encapsulation: ViewEncapsulation.None
})
export class CountingGameComponent {
  static CHILD: string = 'counting';
  questions: GameQ[] = [];
  questionNumber: number = -1;
  currentQ: GameQ = null;
  finished: boolean = true;
  
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
  
  onSubmit(value: any): void {
    console.log(value);
  }
  
  questionContent(): string {
    if (this.currentQ.animals.length < 1) {
      return '';
    }
    var result: string = pluralize(this.currentQ.animals[0].name);
    if (this.currentQ.animals.length == 1) {
      return result;
    }
    if (this.currentQ.animals.length == 2) {
      return result + ` and ${ this.currentQ.animals[this.currentQ.animals.length-1] }`;
    }
    for (var i: number = 1; i < this.currentQ.animals.length-1; i++) {
      result += `, ${ pluralize(this.currentQ.animals[i]) }`;
    }
    result += `, and ${ pluralize(this.currentQ.animals[this.currentQ.animals.length-1]) }`;
    return result;
  }
}