/// <reference path="../../typings/tsd.d.ts" />
import { Injectable } from 'angular2/angular2';

@Injectable()
export class FirebaseService {
  dataRef: Firebase;
  constructor() {
    this.dataRef = new Firebase('https://animals.firebaseIO.com');
  }
}