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
var home_1 = require('./game/home');
var counting_game_1 = require('./game/counting_game');
var what_game_1 = require('./game/what_game');
var memory_game_1 = require('./game/memory_game');
var sight_game_1 = require('./game/sight_game');
var color_game_1 = require('./game/color_game');
var firebase_1 = require('./lib/firebase');
var AppGameComponent = (function () {
    function AppGameComponent(router) {
        this.router = router;
        this.activePage = '';
        this.isHome = true;
    }
    AppGameComponent.prototype.route = function (link) {
        this.isHome = false;
        this.activePage = link;
    };
    AppGameComponent.prototype.setHome = function () {
        this.isHome = true;
        this.activePage = '';
    };
    AppGameComponent = __decorate([
        angular2_1.Component({
            selector: 'app-game'
        }),
        angular2_1.View({
            directives: [router_1.ROUTER_DIRECTIVES, angular2_1.NgClass],
            templateUrl: 'src/app_game.html',
            encapsulation: angular2_1.ViewEncapsulation.None
        }),
        router_1.RouteConfig([
            { path: '/', redirectTo: '/home' },
            { path: '/home', as: 'Home', component: home_1.HomeComponent },
            { path: '/counting', as: 'Counting', component: counting_game_1.CountingGameComponent },
            { path: '/what', as: 'What', component: what_game_1.WhatGameComponent },
            { path: '/memory', as: 'Memory', component: memory_game_1.MemoryGameComponent },
            { path: '/sight', as: 'Sight', component: sight_game_1.SightGameComponent },
            { path: '/color', as: 'Color', component: color_game_1.ColorGameComponent }
        ]), 
        __metadata('design:paramtypes', [router_1.Router])
    ], AppGameComponent);
    return AppGameComponent;
})();
exports.AppGameComponent = AppGameComponent;
angular2_1.bootstrap(AppGameComponent, [
    router_1.ROUTER_BINDINGS,
    angular2_1.bind(router_1.ROUTER_PRIMARY_COMPONENT).toValue(AppGameComponent),
    angular2_1.bind(router_1.APP_BASE_HREF).toValue('/'),
    angular2_1.bind(router_1.LocationStrategy).toClass(router_1.HashLocationStrategy),
    firebase_1.FirebaseService
]);
