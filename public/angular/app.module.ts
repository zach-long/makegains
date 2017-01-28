import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AuthComponent } from './authentication/authentication.component';
import { WorkoutComponent } from './workout/workout.component';
import { ExerciseComponent } from './exercise/exercise.component';

@NgModule({
  imports:      [ BrowserModule,
                  HttpModule ],
  declarations: [ AppComponent,
                  AuthComponent,
                  WorkoutComponent,
                  ExerciseComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
