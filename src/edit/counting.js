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
/// <reference path="../../typings/tsd.d.ts" />
var angular2_1 = require('angular2/angular2');
var firebase_1 = require('../lib/firebase');
var CountingComponent = (function () {
    function CountingComponent(firebase) {
        var _this = this;
        this.firebase = firebase;
        this.questions = [];
        Rx.Observable.create(function (observer) {
            _this.firebase.dataRef.child('counting').on('value', function (snapshot) {
                observer.onNext(snapshot.val());
            });
        })
            .flatMap(function (val) {
            return Rx.Observable.from(Object.keys(val).sort())
                .map(function (key) { return val[key]; })
                .toArray();
        })
            .flatMap(function (qs) {
            var counting = 0;
            return Rx.Observable.from(qs)
                .flatMap(function (q) {
                return Rx.Observable.from(Object.keys(q))
                    .map(function (animal) { return q[animal]; })
                    .toArray();
            })
                .map(function (pairs) {
                counting++;
                return { value: counting, animals: pairs };
            })
                .toArray();
        })
            .subscribeOnNext(function (questions) {
            _this.questions = questions;
        });
    }
    CountingComponent.prototype.remove = function (value) {
        var _this = this;
        console.log("remove counting/q" + value);
        this.firebase.dataRef.child("counting/q" + value).remove(function (error) {
            if (error != null) {
                console.log("error");
            }
            _this.firebase.dataRef.child('counting').once('value', function (snapshot) {
                var val = snapshot.val();
                var newVal = {};
                var counter = value;
                Object.keys(val).sort().forEach(function (key) {
                    if (key > "q" + counter) {
                        newVal[("q" + counter)] = val[key];
                        counter++;
                    }
                    else {
                        newVal[key] = val[key];
                    }
                });
                _this.firebase.dataRef.child('counting').set(newVal);
            });
        });
    };
    CountingComponent = __decorate([
        angular2_1.Component({
            selector: 'counting'
        }),
        angular2_1.View({
            directives: [angular2_1.NgFor, angular2_1.FORM_DIRECTIVES],
            template: "\n    <p>counting</p>\n    <p>questions</p>\n    <ul>\n      <li *ng-for=\"#q of questions\">\n        <p>question: {{ q.value }}</p>\n        <form #f=\"form\">\n          <div *ng-for=\"#animal of q.animals\">\n            <input type=\"text\" value=\"{{ animal.name }}\">\n            <input type=\"text\" value=\"{{ animal.value }}\">\n          </div>\n        </form>\n        <button type=\"button\">add animal</button>\n        <button type=\"button\" (click)=\"remove(q.value)\">remove question</button>\n      </li>\n      <button type=\"button\">add question</button>\n    </ul>\n  "
        }), 
        __metadata('design:paramtypes', [firebase_1.FirebaseService])
    ], CountingComponent);
    return CountingComponent;
})();
exports.CountingComponent = CountingComponent;
//# sourceMappingURL=counting.js.map