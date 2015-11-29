/// <reference path="../../typings/tsd.d.ts" />
interface CountingQ {
  [animal: string]: AnimalCount;
}

interface AnimalCount {
  name: string;
  count: number;
  flag: boolean;
}