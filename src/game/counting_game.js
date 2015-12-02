var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/// <reference path="../lib/types.d.ts" />
var angular2_1 = require('angular2/angular2');
var firebase_1 = require('../lib/firebase');
var lib_1 = require('../lib/lib');
var CountingGameComponent = (function () {
    function CountingGameComponent(firebase) {
        var _this = this;
        this.firebase = firebase;
        this.questions = [];
        this.questionNumber = -1;
        this.currentQ = null;
        this.animalPics = [];
        this.finished = true;
        this.total = 0;
        this.score = 0;
        this.nextScore = 0;
        this.addScore = false;
        this.firebase.readChild(CountingGameComponent.CHILD)
            .flatMap(function (qs) {
            var counter = 0;
            return Rx.Observable.from(qs)
                .map(function (q) {
                return Object.keys(q)
                    .map(function (animal) { return q[animal]; })
                    .sort(function (left, right) { return left.createdAt - right.createdAt; });
            })
                .map(function (animals) {
                counter++;
                return { value: counter, animals: animals };
            })
                .toArray();
        })
            .subscribeOnNext(function (questions) {
            if (questions != null) {
                _this.questions = questions;
                _this.questionNumber = 1;
                _this.currentQ = _this.questions[0];
                _this.loadAnimalPics(_this.currentQ.animals);
                _this.finished = false;
            }
            else {
                _this.questions = [];
                _this.questionNumber = -1;
                _this.currentQ = null;
                _this.animalPics = [];
                _this.finished = true;
            }
        });
    }
    CountingGameComponent.prototype.capitalize = function (name) {
        return lib_1.capitalize(name);
    };
    CountingGameComponent.prototype.hasQuestions = function () {
        return this.questions.length > 0;
    };
    CountingGameComponent.prototype.loadAnimalPics = function (animals) {
        var pics = [];
        animals.forEach(function (animal) {
            for (var i = 0; i < animal.count; i++) {
                pics.push("assets/" + animal.name + ".png");
            }
        });
        pics = lib_1.shuffle(pics);
        this.animalPics = pics;
        console.log(pics);
    };
    CountingGameComponent.prototype.nextQuestion = function () {
        this.score += this.nextScore;
        this.nextScore = 0;
        this.addScore = false;
        this.questionNumber++;
        if (this.questionNumber > this.questions.length) {
            this.finished = true;
            return;
        }
        this.currentQ = this.questions[this.questionNumber - 1];
        this.loadAnimalPics(this.currentQ.animals);
    };
    CountingGameComponent.prototype.onSubmit = function (value) {
        var total = this.currentQ.animals.length;
        var score = 0;
        this.currentQ.animals.forEach(function (animal) {
            if (value[animal.name] == animal.count) {
                score++;
            }
        });
        this.addScore = true;
        this.total += total;
        this.nextScore = score;
    };
    CountingGameComponent.prototype.questionContent = function () {
        var animals = [];
        this.currentQ.animals.forEach(function (animal) {
            if (animal.flag) {
                animals.push(animal);
            }
        });
        if (animals.length < 1) {
            return '';
        }
        var result = lib_1.pluralize(animals[0].name);
        if (animals.length == 1) {
            return result;
        }
        if (animals.length == 2) {
            return result + (" and " + lib_1.pluralize(animals[animals.length - 1].name));
        }
        for (var i = 1; i < animals.length - 1; i++) {
            result += ", " + lib_1.pluralize(animals[i].name);
        }
        result += ", and " + lib_1.pluralize(animals[animals.length - 1].name);
        return result;
    };
    CountingGameComponent.prototype.spaces = function (name) {
        var count = 0;
        this.currentQ.animals.forEach(function (animal) {
            if (animal.name.length > count) {
                count = animal.name.length;
            }
        });
        var arr = [];
        for (var i = name.length; i <= count; i++) {
            arr.push('&nbsp;');
        }
        return arr;
    };
    CountingGameComponent.CHILD = 'counting';
    CountingGameComponent = __decorate([
        angular2_1.Component({
            selector: 'counting-game'
        }),
        angular2_1.View({
            directives: [angular2_1.FORM_DIRECTIVES, angular2_1.NgFor, angular2_1.NgIf],
            templateUrl: 'src/game/counting_game.html',
            encapsulation: angular2_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [firebase_1.FirebaseService])
    ], CountingGameComponent);
    return CountingGameComponent;
})();
exports.CountingGameComponent = CountingGameComponent;
