"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function classDecorator1(str) {
    console.log('classDecorator1函数的参数: ', str);
    return function (target) {
        console.log('classDecorator1类装饰器: ', str);
    };
}
function classDecorator2(str) {
    console.log('classDecorator2函数的参数: ', str);
    return function (target) {
        console.log('classDecorator2类装饰器: ', str);
    };
}
let A = class A {
};
A = __decorate([
    classDecorator1('Jack'),
    classDecorator2('Joker')
], A);
