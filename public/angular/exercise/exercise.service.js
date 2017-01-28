"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var ExerciseService = (function () {
    function ExerciseService(http) {
        this.http = http;
        console.log('Exercise Service init...');
    }
    ExerciseService.prototype.getExercises = function () {
        return this.http.get('/exercise/myexercises')
            .map(function (res) { return res.json(); });
    };
    ExerciseService.prototype.createExercise = function (newExercise) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/exercise/new', JSON.stringify(newExercise), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    return ExerciseService;
}());
ExerciseService = __decorate([
    core_1.Injectable()
], ExerciseService);
exports.ExerciseService = ExerciseService;
