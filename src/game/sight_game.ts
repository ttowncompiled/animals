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
  selector: 'sight-game'
})
@View({
  directives: [FORM_DIRECTIVES, NgFor, NgIf, NgStyle],
  templateUrl: 'src/game/sight_game.html',
  encapsulation: ViewEncapsulation.None
})
export class SightGameComponent {
  static CHILD: string = 'sight';
  ANIMAL_NAMES = ANIMALS.sort();
  questions: GameQ[] = [];
  questionNumber: number = -1;
  currentQ: GameQ = null;
  finished: boolean = true;
  total: number = 0;
  score: number = 0;
  nextScore: number = 0;
  addScore: boolean = false;
  
  constructor(public firebase: FirebaseService) {
    this.firebase.readChild(SightGameComponent.CHILD)
      .flatMap((qs: SightQ[]) => {
        var counter: number = 0;
        return Rx.Observable.from(qs)
          .map((q: SightQ) => {
            return Object.keys(q)
              .map((animal: string) => q[animal])
              .sort((left: SightWord, right: SightWord) => left.createdAt - right.createdAt);
          })
          .map((animals: SightWord[]) => {
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
    this.currentQ.animals.forEach((animal: AnimalWhat) => {
      if (value['name'].toLowerCase() == animal.name.toLowerCase()) {
        score++;
      }
    });
    this.addScore = true;
    this.total += total;
    this.nextScore = score;
  }
}