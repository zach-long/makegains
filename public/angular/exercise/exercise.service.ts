import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

@Injectable()
export class ExerciseService{
  constructor(private http:Http) {
    console.log('Exercise Service init...');
  }

  getExercises() {
    return this.http.get('/exercise/myexercises')
      .map(res => res.json());
  }

  createExercise(newExercise) {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('/exercise/new',
      JSON.stringify(newExercise),
      {headers: headers})
      .map(res => res.json());
  }
}
