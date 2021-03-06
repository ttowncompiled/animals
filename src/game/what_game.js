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
var WhatGameComponent = (function () {
    function WhatGameComponent(firebase) {
        var _this = this;
        this.firebase = firebase;
        this.ANIMAL_NAMES = lib_1.ANIMALS.sort();
        this.questions = [];
        this.questionNumber = -1;
        this.currentQ = null;
        this.finished = true;
        this.total = 0;
        this.score = 0;
        this.nextScore = 0;
        this.addScore = false;
        this.firebase.readChild(WhatGameComponent.CHILD)
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
                _this.finished = false;
            }
            else {
                _this.questions = [];
                _this.questionNumber = -1;
                _this.currentQ = null;
                _this.finished = true;
            }
        });
    }
    WhatGameComponent.prototype.capitalize = function (name) {
        return lib_1.capitalize(name);
    };
    WhatGameComponent.prototype.hasQuestions = function () {
        return this.questions.length > 0;
    };
    WhatGameComponent.prototype.nextQuestion = function () {
        this.score += this.nextScore;
        this.nextScore = 0;
        this.addScore = false;
        this.questionNumber++;
        if (this.questionNumber > this.questions.length) {
            this.finished = true;
            return;
        }
        this.currentQ = this.questions[this.questionNumber - 1];
    };
    WhatGameComponent.prototype.onSubmit = function (value) {
        var total = this.currentQ.animals.length;
        var score = 0;
        this.currentQ.animals.forEach(function (animal) {
            if (value['name'].toLowerCase() == animal.name.toLowerCase()) {
                score++;
            }
        });
        this.addScore = true;
        this.total += total;
        this.nextScore = score;
    };
    WhatGameComponent.CHILD = 'what';
    WhatGameComponent = __decorate([
        angular2_1.Component({
            selector: 'what-game'
        }),
        angular2_1.View({
            directives: [angular2_1.FORM_DIRECTIVES, angular2_1.NgFor, angular2_1.NgIf, angular2_1.NgStyle],
            templateUrl: 'src/game/what_game.html',
            encapsulation: angular2_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [firebase_1.FirebaseService])
    ], WhatGameComponent);
    return WhatGameComponent;
})();
exports.WhatGameComponent = WhatGameComponent;
