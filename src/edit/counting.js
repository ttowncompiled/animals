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
        firebase.dataRef.child('counting').on('value', function (snapshot) {
            var val = snapshot.val();
            var questions = [];
            var counter = 0;
            Object.keys(val).sort().forEach(function (key) {
                counter++;
                var pairs = [];
                Object.keys(val[key]).forEach(function (animal) {
                    pairs.push(val[key][animal]);
                });
                questions.push({ value: counter, animals: pairs });
            });
            _this.questions = questions;
        });
    }
    CountingComponent = __decorate([
        angular2_1.Component({
            selector: 'counting'
        }),
        angular2_1.View({
            directives: [angular2_1.NgFor],
            template: "\n    <p>counting</p>\n    <p>questions</p>\n    <ul>\n      <li *ng-for=\"#q of questions\">\n        <p>question: {{ q.value }}</p>\n        <div *ng-for=\"#animal of q.animals\">\n          <p>name: {{ animal.name }}</p>\n          <p>value: {{ animal.value }}</p>\n      </li>\n    </ul>\n  "
        }), 
        __metadata('design:paramtypes', [firebase_1.FirebaseService])
    ], CountingComponent);
    return CountingComponent;
})();
exports.CountingComponent = CountingComponent;
//# sourceMappingURL=counting.js.map