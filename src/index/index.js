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
var home_1 = require('../home/home');
var edit_1 = require('../edit/edit');
var Index = (function () {
    function Index(router) {
        this.router = router;
    }
    Index = __decorate([
        angular2_1.Component({
            selector: 'index'
        }),
        angular2_1.View({
            directives: [router_1.ROUTER_DIRECTIVES],
            template: "\n    <div class=\"row\">\n      <div class=\"col s12\">\n        <a [router-link]=\"['/Home']\">Home</a>\n      </div>\n    </div>\n    <div class=\"container\">\n      <div class=\"center-align\">\n        <router-outlet></router-outlet>\n      </div>\n    </div>\n  "
        }),
        router_1.RouteConfig([
            { path: "/", redirectTo: "/home" },
            { path: "/home", as: "Home", component: home_1.Home },
            { path: "/edit", as: "Edit", component: edit_1.Edit }
        ]), 
        __metadata('design:paramtypes', [router_1.Router])
    ], Index);
    return Index;
})();
exports.Index = Index;
angular2_1.bootstrap(Index, [
    router_1.ROUTER_BINDINGS,
    angular2_1.bind(router_1.ROUTER_PRIMARY_COMPONENT).toValue(Index),
    angular2_1.bind(router_1.APP_BASE_HREF).toValue("/")
]);
//# sourceMappingURL=index.js.map