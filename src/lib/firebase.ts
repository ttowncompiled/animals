/// <reference path="../../typings/tsd.d.ts" />
import { ControlGroup, Injectable } from 'angular2/angular2';

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
  
  public addAnimal(ext: string, question: number, animal: string, value: any): void {
    var child: string = `${ ext }/${ FirebaseService.questionFormat(question) }/${ animal }`;
    this.dataRef.child(child).set(value);
  }
  
  public addQuestion(ext: string, question: number, animal: string, value: any): void {
    var new_question: any = {};
    var new_animal: any = {};
    new_animal[animal] = value;
    new_question[FirebaseService.questionFormat(question)] = new_animal;
    this.dataRef.child(ext).update(new_question);
  }
  
  public observeChanges(group: ControlGroup, ext: string, question: number, animal: string): void {
    var child: string = `${ ext }/${ FirebaseService.questionFormat(question) }/`;
    group.valueChanges
      .debounceTime(500)
      .subscribe((value: any) => {
        if (group.value.name != animal) {
          this.dataRef.child(child + animal).remove((error: any) => {
            if (error != null) {
              console.error(error);
              return;
            }
            this.dataRef.child(child + group.value.name).set(group.value);
          })
        } else {
          this.dataRef.child(child + animal).update(group.value);
        }
      });
  }
  
  public onChild(ext: string): Rx.Observable<any> {
    return Rx.Observable.create((observer: Rx.Observer<any>) => {
        this.dataRef.child(ext).on('value', (snapshot: FirebaseDataSnapshot) => {
          observer.onNext(snapshot.val());
        });
      })
      .flatMap((val: any) => {
        return Rx.Observable.from(Object.keys(val).sort())
          .map((key: string) => val[key])
          .toArray();
      });
  }
  
  public removeAnimal(ext: string, question: number, animal: string): void {
    var child: string = `${ ext }/${ FirebaseService.questionFormat(question) }/${ animal }`;
    this.dataRef.child(child).remove((error: any) => {
      if (error != null) {
        console.error(error);
      }
    })
  }
  
  public removeQuestion(ext: string, question: number): void {
    var child: string = `${ ext }/${ FirebaseService.questionFormat(question) }`;
    this.dataRef.child(child).remove((error: any) => {
      if (error != null) {
        console.error(error);
        return;
      }
      this.renumberQuestions(ext, question);
    });
  }
  
  public renumberQuestions(ext: string, value: number): void {
    this.dataRef.child(ext).once('value', (snapshot: FirebaseDataSnapshot) => {
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
      this.dataRef.child(ext).set(newVal);
    });
  }
}