import { Control, ControlGroup } from 'angular2/angular2';

export const ANIMALS = [
  'cat',
  'dog',
  'pig',
  'cow',
  'horse',
  'monkey',
  'lion',
  'tiger',
  'bear',
  'frog',
  'butterfly',
  'owl',
  'bat',
  'bee',
  'giraffe',
  'flamingo',
  'elephant',
  'zebra',
  'snake',
  'ladybug',
  'caterpillar'
];

export interface Question {
  value: number;
  animals: ControlGroup[];
  new_animal: Control;
}

export function capitalize(name: string): string {
  return name[0].toUpperCase() + name.substring(1);
}

export function pluralize(name: string): string {
  switch(name) {
    case 'cat': return 'cat(s)';
    case 'dog': return 'dog(s)';
    case 'pig': return 'pig(s)';
    case 'cow': return 'cow(s)';
    case 'horse': return 'horse(s)';
    case 'monkey': return 'monkey(s)';
    case 'lion': return 'lion(s)';
    case 'tiger': return 'tiger(s)';
    case 'bear': return 'bear(s)';
    case 'frog': return 'frog(s)';
    case 'butterfly': return 'butterfly(ies)';
    case 'owl': return 'owl(s)';
    case 'bat': return 'bat(s)';
    case 'bee': return 'bee(s)';
    case 'giraffe': return 'giraffe(s)';
    case 'flamingo': return 'flamingo(s)';
    case 'elephant': return 'elephant(s)';
    case 'zebra': return 'zebra(s)';
    case 'snake': return 'snake(s)';
    case 'ladybug': return 'ladybug(s)';
    case 'caterpillar': return 'caterpillar(s)';
  }
  return name;
}

export function shuffle(array: any[]): any[] {
  var idx: number = array.length;
  while (idx != 0) {
    var randomIdx: number = Math.floor(Math.random() * idx);
    idx--;
    var tmp: any = array[idx];
    array[idx] = array[randomIdx];
    array[randomIdx] = tmp;
  }
  return array;
}