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
  
  public static pluralize(name: string): string {
    switch(name) {
      case 'cow': return 'cow(s)';
      case 'pig': return 'pig(s)';
    }
    return name;
  }
  
  constructor() {
    this.dataRef = new Firebase('https://animals.firebaseIO.com');
  }
  
  public onChild(child: string): Rx.Observable<any> {
    return Rx.Observable.create((observer: Rx.Observer<any>) => {
        this.dataRef.child(child).on('value', (snapshot: FirebaseDataSnapshot) => {
          observer.onNext(snapshot.val());
        });
      })
      .flatMap((val: any) => {
        return Rx.Observable.from(Object.keys(val).sort())
          .map((key: string) => val[key])
          .toArray();
      });
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