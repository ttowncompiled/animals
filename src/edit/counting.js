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
var CountingComponent = (function () {
    function CountingComponent(firebase) {
        var _this = this;
        this.firebase = firebase;
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
                return { value: counter, animals: groups };
            })
                .toArray();
        })
            .subscribeOnNext(function (questions) {
            _this.questions = questions;
        });
    }
    CountingComponent.prototype.remove = function (value) {
        this.firebase.removeQuestion(CountingComponent.CHILD, value);
    };
    CountingComponent.CHILD = 'counting';
    CountingComponent = __decorate([
        angular2_1.Component({
            selector: 'counting'
        }),
        angular2_1.View({
            directives: [angular2_1.FORM_DIRECTIVES, angular2_1.NgFor],
            template: "\n    <p>counting</p>\n    <p>questions</p>\n    <ul>\n      <li *ng-for=\"#q of questions\">\n        <p>question: {{ q.value }}</p>\n        <div *ng-for=\"#animal of q.animals\">\n          <form [ng-form-model]=\"animal\">\n            <input type=\"text\" [ng-form-control]=\"animal.controls['name']\">\n            <input type=\"text\" [ng-form-control]=\"animal.controls['count']\">\n          </form>\n        </div>\n        <button type=\"button\">add animal</button>\n        <button type=\"button\" (click)=\"remove(q.value)\">remove question</button>\n      </li>\n      <button type=\"button\">add question</button>\n    </ul>\n  ",
            encapsulation: angular2_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [firebase_1.FirebaseService])
    ], CountingComponent);
    return CountingComponent;
})();
exports.CountingComponent = CountingComponent;
