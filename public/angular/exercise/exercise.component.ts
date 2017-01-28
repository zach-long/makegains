import { Component } from '@angular/core';
import { ExerciseService } from './exercise.service';
import { Exercise } from './exercise';

@Component({
  selector: 'exercise',
  templateUrl: '/angular/exercise/exercise.component.html'
})

export class ExerciseComponent {
  /*exercises: Exercise[];

  constructor(private exerciseService:ExerciseService){
    this.exerciseService.getExercises()
      .subscribe(exercises => {
        this.exercises = exercises;
      });
  }*/
}
