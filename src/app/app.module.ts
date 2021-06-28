import {ErrorHandler, NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA} from '@angular/core';
import {HttpModule} from '@angular/http';
import {BrowserModule} from '@angular/platform-browser';
import {IonicStorageModule} from '@ionic/storage';
import {compose} from '@ngrx/core/compose';
import {combineReducers, StoreModule} from '@ngrx/store';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {AppSync} from '../redux/appstate';
import {ReduxProviders} from '../redux/redux-providers';
import {RootReducer} from '../redux/root-reducer';
import {localStorageSync} from '../redux/storage-sync';
import {MyApp} from './app.component';
import {NativeProviders, PAGES, PIPES, PROVIDERS} from './app.contents';
import {EffectsModule} from '@ngrx/effects';
import {PushNotificationEffects} from '../redux/pushnotf';
import {DeviceActionEffects} from '../redux/device';
import {SessionEffects} from '../redux/session';
import {CurrentScorecardEffects} from '../redux/scorecard';
import {WebsocketEffects} from '../redux/wstomp';
import {ScorerStateEffects} from '../redux/scorer-state';
import {AdvertisementComponent} from '../custom/advertisement-component';
import {AdhandlerComponent} from '../custom/adhandler-component';
import { MygolfChartComponent } from '../charts/mygolf-chart';
import { NgCalendarModule } from 'ionic2-calendar';
import { RecaptchaModule } from 'ng-recaptcha';
const prodReducer = compose(localStorageSync({
        keys     : AppSync,
        prefix   : 'mygolf2uscorer',
        rehydrate: true
    }),
    combineReducers)(RootReducer);
export function appReducer(state: any = {}, action: any) {
    return prodReducer(state, action);
}
@NgModule({
    declarations   : [
        MyApp,
        AdvertisementComponent,
        AdhandlerComponent,
        ...PAGES,
        ...PIPES,
        MygolfChartComponent
    ],
    imports        : [
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot(),
        StoreModule.provideStore(appReducer),
        // StoreDevtoolsModule.instrumentOnlyWithExtension({
        //     maxAge: 5
        // }),
        EffectsModule.runAfterBootstrap(PushNotificationEffects),
        EffectsModule.runAfterBootstrap(DeviceActionEffects),
        EffectsModule.runAfterBootstrap(SessionEffects),
        EffectsModule.runAfterBootstrap(CurrentScorecardEffects),
        EffectsModule.runAfterBootstrap(WebsocketEffects),
        EffectsModule.runAfterBootstrap(ScorerStateEffects),
        NgCalendarModule,
        RecaptchaModule.forRoot(),
    ],
    bootstrap      : [IonicApp],
    entryComponents: [
        MyApp,
        ...PAGES
    ],
    providers      : [{provide: ErrorHandler, useClass: IonicErrorHandler},
                      ...PROVIDERS,
                      ...ReduxProviders,
                        ...NativeProviders
    ],
    schemas:[CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class AppModule {
}
