/// <reference path="../../typings/tsd.d.ts" />
import { Injectable } from 'angular2/angular2';

@Injectable()
export class FirebaseService {
  dataRef: Firebase;
  
  public static questionFormat(value: number): string {
    if (value < 10) {
      return `q0${ value }`;
    }
    return `q${ value }`;
  }
  
  constructor() {
    this.dataRef = new Firebase('https://animals.firebaseIO.com');
  }
  
  public renumberQuestions(child: string, value: number): void {
    this.dataRef.child(child).once('value', (snapshot: FirebaseDataSnapshot) => {
        var counter: number = value;
        var val: any = snapshot.val();
        var newVal: any = {};
        Object.keys(val).sort().forEach((key: string) => {
          if (key > `${ FirebaseService.questionFormat(counter) }`) {
            newVal[`${ FirebaseService.questionFormat(counter) }`] = val[key];
            counter++;
          } else {
            newVal[key] = val[key];
          }
        });
        this.dataRef.child('counting').set(newVal);
      });
  }
}