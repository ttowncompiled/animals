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
/// <reference path="../../typings/tsd.d.ts" />
var angular2_1 = require('angular2/angular2');
var FirebaseService = (function () {
    function FirebaseService() {
        this.dataRef = new Firebase('https://animals.firebaseIO.com');
    }
    FirebaseService.questionFormat = function (value) {
        if (value < 10) {
            return "q0" + value;
        }
        return "q" + value;
    };
    FirebaseService.prototype.observeChanges = function (group, ext, question, animal) {
        var _this = this;
        var child = ext + "/" + FirebaseService.questionFormat(question) + "/";
        group.valueChanges
            .debounceTime(100)
            .subscribe(function (value) {
            if (group.value.name != animal) {
                _this.dataRef.child(child + animal).remove(function (error) {
                    if (error != null) {
                        console.error(error);
                        return;
                    }
                    _this.dataRef.child(child + group.value.name).set(group.value);
                });
            }
            else {
                _this.dataRef.child(child + animal).update(group.value);
            }
        });
    };
    FirebaseService.prototype.onChild = function (ext) {
        var _this = this;
        return Rx.Observable.create(function (observer) {
            _this.dataRef.child(ext).on('value', function (snapshot) {
                observer.onNext(snapshot.val());
            });
        })
            .flatMap(function (val) {
            return Rx.Observable.from(Object.keys(val).sort())
                .map(function (key) { return val[key]; })
                .toArray();
        });
    };
    FirebaseService.prototype.removeQuestion = function (ext, question) {
        var _this = this;
        var child = ext + "/" + FirebaseService.questionFormat(question);
        this.dataRef.child(child).remove(function (error) {
            if (error != null) {
                console.error(error);
                return;
            }
            _this.renumberQuestions(ext, question);
        });
    };
    FirebaseService.prototype.renumberQuestions = function (ext, value) {
        var _this = this;
        this.dataRef.child(ext).once('value', function (snapshot) {
            var counter = value;
            var val = snapshot.val();
            var newVal = {};
            Object.keys(val).sort().forEach(function (key) {
                if (key > "" + FirebaseService.questionFormat(counter)) {
                    newVal[("" + FirebaseService.questionFormat(counter))] = val[key];
                    counter++;
                }
                else {
                    newVal[key] = val[key];
                }
            });
            _this.dataRef.child(ext).set(newVal);
        });
    };
    FirebaseService = __decorate([
        angular2_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], FirebaseService);
    return FirebaseService;
})();
exports.FirebaseService = FirebaseService;
