/// <reference path="../../typings/tsd.d.ts" />
interface CountingQ {
  [animal: string]: AnimalCount;
}

interface AnimalCount {
  name: string;
  count: number;
  flag: boolean;
  createdAt: number;
}

interface WhatQ {
  [animal: string]: AnimalWhat;
}

interface AnimalWhat {
  name: string;
  descr: string;
  createdAt: number;
}

interface GameQ {
  value: number;
  animals: any[];
}