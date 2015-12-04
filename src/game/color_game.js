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
var ColorGameComponent = (function () {
    function ColorGameComponent(firebase) {
        var _this = this;
        this.firebase = firebase;
        this.questions = [];
        this.questionNumber = -1;
        this.currentQ = null;
        this.colors = [];
        this.selected = '';
        this.finished = true;
        this.total = 0;
        this.score = 0;
        this.nextScore = 0;
        this.addScore = false;
        this.firebase.readChild(ColorGameComponent.CHILD)
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
                _this.colors = _this.loadColors();
                _this.finished = false;
            }
            else {
                _this.questions = [];
                _this.questionNumber = -1;
                _this.currentQ = null;
                _this.colors = [];
                _this.finished = true;
            }
        });
    }
    ColorGameComponent.prototype.capitalize = function (name) {
        return lib_1.capitalize(name);
    };
    ColorGameComponent.prototype.hasQuestions = function () {
        return this.questions.length > 0;
    };
    ColorGameComponent.prototype.loadColors = function () {
        var result = [];
        var colors = Object.keys(lib_1.COLORS);
        result.push(lib_1.COLORS[this.currentQ.animals[0].color]);
        colors.splice(colors.indexOf(this.currentQ.animals[0].color), 1);
        for (var i = 0; i < 7; i++) {
            var idx = Math.floor(Math.random() * colors.length);
            result.push(lib_1.COLORS[colors[idx]]);
            colors.splice(idx, 1);
        }
        result = lib_1.shuffle(result);
        var arrangement = [];
        arrangement.push(result.slice(0, result.length / 2));
        arrangement.push(result.slice(result.length / 2, result.length));
        return arrangement;
    };
    ColorGameComponent.prototype.nextQuestion = function () {
        this.score += this.nextScore;
        this.nextScore = 0;
        this.addScore = false;
        this.questionNumber++;
        if (this.questionNumber > this.questions.length) {
            this.finished = true;
            return;
        }
        this.currentQ = this.questions[this.questionNumber - 1];
        this.colors = this.loadColors();
        this.selected = '';
    };
    ColorGameComponent.prototype.onSubmit = function (value) {
        var _this = this;
        var total = this.currentQ.animals.length;
        var score = 0;
        this.currentQ.animals.forEach(function (animal) {
            if (_this.selected == lib_1.COLORS[_this.currentQ.animals[0].color]) {
                score++;
            }
        });
        this.addScore = true;
        this.total += total;
        this.nextScore = score;
    };
    ColorGameComponent.prototype.select = function (color) {
        this.selected = color;
    };
    ColorGameComponent.CHILD = 'color';
    ColorGameComponent = __decorate([
        angular2_1.Component({
            selector: 'color-game'
        }),
        angular2_1.View({
            directives: [angular2_1.FORM_DIRECTIVES, angular2_1.NgFor, angular2_1.NgIf, angular2_1.NgStyle],
            templateUrl: 'src/game/color_game.html',
            encapsulation: angular2_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [firebase_1.FirebaseService])
    ], ColorGameComponent);
    return ColorGameComponent;
})();
exports.ColorGameComponent = ColorGameComponent;
