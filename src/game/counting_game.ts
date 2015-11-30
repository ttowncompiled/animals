/// <reference path="../lib/types.d.ts" />
import {
  Component,
  NgFor,
  View,
  ViewEncapsulation
} from 'angular2/angular2';
import { FirebaseService } from '../lib/firebase';
import { ANIMALS, capitalize } from '../lib/lib';
declare var Rx;

@Component({
  selector: 'counting-game'
})
@View({
  directives: [NgFor],
  templateUrl: 'src/game/counting_game.html',
  encapsulation: ViewEncapsulation.None
})
export class CountingGameComponent {
  static CHILD: string = 'counting';
  ANIMAL_NAMES: string[] = ANIMALS.sort();
  questions: GameQ[] = [];
  
  constructor(public firebase: FirebaseService) {
    this.firebase.onChild(CountingGameComponent.CHILD)
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
        } else {
          this.questions = [];
        }
      });
  }
  
  capitalize(name: string): string {
    return capitalize(name);
  }
}