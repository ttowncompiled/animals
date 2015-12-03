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
        this.selected = -1;
        this.finished = false;
        this.score = 0;
        this.nextScore = 0;
        this.addScore = false;
        this.questions = this.loadQuestions();
        this.currentQ = this.questions[0];
    }
    MemoryGameComponent.prototype.capitalize = function (name) {
        return lib_1.capitalize(name);
    };
    MemoryGameComponent.prototype.hasQuestions = function () {
        return this.questions.length > 0;
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
        this.selected = -1;
        this.questionNumber++;
        if (this.questionNumber > this.questions.length) {
            this.finished = true;
            return;
        }
        this.currentQ = this.questions[this.questionNumber - 1];
    };
    MemoryGameComponent.prototype.select = function (id) {
        this.selected = id;
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
