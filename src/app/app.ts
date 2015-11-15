import {bootstrap, Component, View} from 'angular2/angular2';

@Component({selector: 'my-app'})
@View({templateUrl: 'src/app/app.html'})
class AppComponent { }

bootstrap(AppComponent);