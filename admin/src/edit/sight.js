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
var SightComponent = (function () {
    function SightComponent(firebase) {
        var _this = this;
        this.firebase = firebase;
        this.ANIMAL_NAMES = lib_1.ANIMALS.sort();
        this.questions = [];
        this.new_question = new angular2_1.Control("");
        this.firebase.onChild(SightComponent.CHILD)
            .flatMap(function (qs) {
            var counter = 0;
            return Rx.Observable.from(qs)
                .map(function (q) {
                return Object.keys(q)
                    .map(function (animal) { return q[animal]; })
                    .sort(function (left, right) { return left.createdAt - right.createdAt; })
                    .map(function (pair) {
                    return new angular2_1.ControlGroup({
                        name: new angular2_1.Control(pair.name),
                        createdAt: new angular2_1.Control(pair.createdAt)
                    });
                });
            })
                .map(function (groups) {
                counter++;
                groups.forEach(function (g) {
                    _this.firebase.observeChanges(g, SightComponent.CHILD, counter, g.controls['name'].value);
                });
                var control = new angular2_1.Control("");
                _this.listenForNewAnimal(control, counter);
                return { value: counter, animals: groups, new_animal: control };
            })
                .toArray();
        })
            .subscribeOnNext(function (questions) {
            if (questions != null) {
                _this.questions = questions;
            }
            else {
                _this.questions = [];
            }
        });
        this.listenForNewQuestion();
    }
    SightComponent.prototype.capitalize = function (name) {
        return lib_1.capitalize(name);
    };
    SightComponent.prototype.listenForNewAnimal = function (control, question) {
        var _this = this;
        control.valueChanges
            .debounceTime(500)
            .subscribe(function (name) {
            var value = { name: name, createdAt: Firebase.ServerValue.TIMESTAMP };
            _this.firebase.addAnimal(SightComponent.CHILD, question, name, value);
        });
    };
    SightComponent.prototype.listenForNewQuestion = function () {
        var _this = this;
        this.new_question.valueChanges
            .debounceTime(500)
            .subscribe(function (name) {
            var value = { name: name, createdAt: Firebase.ServerValue.TIMESTAMP };
            _this.firebase.addQuestion(SightComponent.CHILD, _this.questions.length + 1, name, value);
            _this.new_question = new angular2_1.Control("");
            _this.listenForNewQuestion();
        });
    };
    SightComponent.prototype.removeAnimal = function (question, name) {
        this.firebase.removeAnimal(SightComponent.CHILD, question, name);
    };
    SightComponent.prototype.removeQuestion = function (question) {
        this.firebase.removeQuestion(SightComponent.CHILD, question);
    };
    SightComponent.CHILD = 'sight';
    SightComponent = __decorate([
        angular2_1.Component({
            selector: 'sight'
        }),
        angular2_1.View({
            directives: [angular2_1.FORM_DIRECTIVES, angular2_1.NgFor],
            templateUrl: 'src/edit/sight.html',
            encapsulation: angular2_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [firebase_1.FirebaseService])
    ], SightComponent);
    return SightComponent;
})();
exports.SightComponent = SightComponent;
