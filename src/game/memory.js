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
var lib_1 = require('../lib/lib');
var MemoryGameComponent = (function () {
    function MemoryGameComponent() {
        this.questionNumber = 1;
        this.questions = [];
        this.currentQ = null;
        this.selected = { id: -1, name: '' };
        this.matches = {};
        this.matched = 0;
        this.finished = false;
        this.total = 0;
        this.score = 0;
        this.nextScore = 0;
        this.addScore = false;
        this.questions = this.loadQuestions();
        this.currentQ = this.questions[0];
        this.matches = this.setupMatches();
    }
    MemoryGameComponent.prototype.capitalize = function (name) {
        return lib_1.capitalize(name);
    };
    MemoryGameComponent.prototype.calculateOffset = function () {
        return Math.floor((12 - this.currentQ.animals[0].length) / 2);
    };
    MemoryGameComponent.prototype.hasQuestions = function () {
        return this.questions.length > 0;
    };
    MemoryGameComponent.prototype.isMatched = function (name) {
        return this.matches[name];
    };
    MemoryGameComponent.prototype.loadQuestions = function () {
        var questions = [];
        var count = 2;
        var id = 0;
        for (var i = 1; i <= 10; i++) {
            var animals = [];
            var names = lib_1.ANIMALS.slice();
            for (var j = 1; j <= count; j++) {
                var idx = Math.floor(Math.random() * names.length);
                animals.push({ id: id, name: names[idx] });
                id++;
                animals.push({ id: id, name: names[idx] });
                id++;
                names.splice(idx, 1);
            }
            animals = lib_1.shuffle(animals);
            var arrangement = [];
            arrangement.push(animals.slice(0, animals.length / 2));
            arrangement.push(animals.slice(animals.length / 2, animals.length));
            if (i % 2 == 0) {
                count++;
            }
            var q = { value: i, animals: arrangement };
            questions.push(q);
        }
        return questions;
    };
    MemoryGameComponent.prototype.nextQuestion = function () {
        this.score += this.nextScore;
        this.nextScore = 0;
        this.addScore = false;
        this.selected = { id: -1, name: '' };
        this.matched = 0;
        this.questionNumber++;
        if (this.questionNumber > this.questions.length) {
            this.finished = true;
            return;
        }
        this.currentQ = this.questions[this.questionNumber - 1];
        this.matches = this.setupMatches();
    };
    MemoryGameComponent.prototype.select = function (id, name) {
        if (this.selected.name == name) {
            this.matches[name] = true;
            this.matched++;
        }
        if (this.matched == this.currentQ.animals[0].length) {
            this.showScore();
        }
        else {
            this.selected = { id: id, name: name };
        }
    };
    MemoryGameComponent.prototype.setupMatches = function () {
        var matches = {};
        this.currentQ.animals.forEach(function (animals) {
            animals.forEach(function (animal) {
                matches[animal.name] = false;
            });
        });
        return matches;
    };
    MemoryGameComponent.prototype.showScore = function () {
        this.addScore = true;
        this.total += this.currentQ.animals[0].length;
        this.nextScore = this.currentQ.animals[0].length;
    };
    MemoryGameComponent = __decorate([
        angular2_1.Component({
            selector: 'memory-game'
        }),
        angular2_1.View({
            directives: [angular2_1.FORM_DIRECTIVES, angular2_1.NgFor, angular2_1.NgIf, angular2_1.NgStyle],
            templateUrl: 'src/game/memory_game.html',
            encapsulation: angular2_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [])
    ], MemoryGameComponent);
    return MemoryGameComponent;
})();
exports.MemoryGameComponent = MemoryGameComponent;
