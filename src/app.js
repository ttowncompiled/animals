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
var angular2_1 = require('angular2/angular2');
var router_1 = require('angular2/router');
var counting_1 = require('./edit/counting');
var what_1 = require('./edit/what');
var firebase_1 = require('./lib/firebase');
var AppComponent = (function () {
    function AppComponent(router) {
        this.router = router;
        this.activePage = 'counting';
    }
    AppComponent.prototype.setActive = function (page) {
        this.activePage = page;
    };
    AppComponent = __decorate([
        angular2_1.Component({
            selector: 'app'
        }),
        angular2_1.View({
            directives: [router_1.ROUTER_DIRECTIVES, angular2_1.NgClass],
            templateUrl: 'src/app.html',
            encapsulation: angular2_1.ViewEncapsulation.None
        }),
        router_1.RouteConfig([
            { path: '/', redirectTo: '/counting' },
            { path: '/counting', as: 'Counting', component: counting_1.CountingComponent },
            { path: '/what', as: 'What', component: what_1.WhatComponent }
        ]), 
        __metadata('design:paramtypes', [router_1.Router])
    ], AppComponent);
    return AppComponent;
})();
exports.AppComponent = AppComponent;
angular2_1.bootstrap(AppComponent, [
    router_1.ROUTER_BINDINGS,
    angular2_1.bind(router_1.ROUTER_PRIMARY_COMPONENT).toValue(AppComponent),
    angular2_1.bind(router_1.APP_BASE_HREF).toValue('/'),
    angular2_1.bind(router_1.LocationStrategy).toClass(router_1.HashLocationStrategy),
    firebase_1.FirebaseService
]);
