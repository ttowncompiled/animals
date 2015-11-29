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
var CountingComponent = (function () {
    function CountingComponent(firebase) {
        var _this = this;
        this.firebase = firebase;
        this.ANIMAL_NAMES = lib_1.ANIMALS;
        this.questions = [];
        this.firebase.onChild(CountingComponent.CHILD)
            .flatMap(function (qs) {
            var counter = 0;
            return Rx.Observable.from(qs)
                .flatMap(function (q) {
                counter++;
                return Rx.Observable.from(Object.keys(q))
                    .map(function (animal) { return q[animal]; })
                    .map(function (pair) {
                    var group = new angular2_1.ControlGroup({
                        name: new angular2_1.Control(pair.name),
                        count: new angular2_1.Control(pair.count)
                    });
                    _this.firebase.observeChanges(group, CountingComponent.CHILD, counter, pair.name);
                    return group;
                })
                    .toArray();
            })
                .map(function (groups) {
                var control = new angular2_1.Control("");
                _this.listenForNewAnimal(control, counter);
                return { value: counter, animals: groups, new_animal: control };
            })
                .toArray();
        })
            .subscribeOnNext(function (questions) {
            _this.questions = questions;
        });
    }
    CountingComponent.prototype.capitalize = function (name) {
        return lib_1.capitalize(name);
    };
    CountingComponent.prototype.listenForNewAnimal = function (control, question) {
        var _this = this;
        control.valueChanges.subscribe(function (name) {
            var value = { name: name, count: 0 };
            _this.firebase.addAnimal(CountingComponent.CHILD, question, name, value);
        });
    };
    CountingComponent.prototype.removeAnimal = function (question, name) {
        this.firebase.removeAnimal(CountingComponent.CHILD, question, name);
    };
    CountingComponent.prototype.removeQuestion = function (question) {
        this.firebase.removeQuestion(CountingComponent.CHILD, question);
    };
    CountingComponent.CHILD = 'counting';
    CountingComponent = __decorate([
        angular2_1.Component({
            selector: 'counting'
        }),
        angular2_1.View({
            directives: [angular2_1.FORM_DIRECTIVES, angular2_1.NgFor],
            template: "\n    <p>counting</p>\n    <p>questions</p>\n    <ul>\n      <li *ng-for=\"#q of questions\">\n        <p>question: {{ q.value }}</p>\n        <div *ng-for=\"#animal of q.animals\">\n          <form [ng-form-model]=\"animal\">\n            <select [ng-form-control]=\"animal.controls['name']\">\n              <option *ng-for=\"#name of ANIMAL_NAMES\" [value]=\"name\">{{ capitalize(name) }}</option>\n            </select>\n            <input type=\"text\" [ng-form-control]=\"animal.controls['count']\">\n            <button type=\"button\" (click)=\"removeAnimal(q.value, animal.controls['name'].value)\">remove animal</button>\n          </form>\n        </div>\n        <select [ng-form-control]=\"q.new_animal\">\n          <option value=\"none\" selected>None</option>\n          <option *ng-for=\"#name of ANIMAL_NAMES\" [value]=\"name\">{{ capitalize(name) }}</option>\n        </select>\n        <button type=\"button\" (click)=\"removeQuestion(q.value)\">remove question</button>\n      </li>\n      <button type=\"button\">add question</button>\n    </ul>\n  ",
            encapsulation: angular2_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [firebase_1.FirebaseService])
    ], CountingComponent);
    return CountingComponent;
})();
exports.CountingComponent = CountingComponent;
