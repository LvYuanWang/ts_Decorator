"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function d0(target, key) {
    console.log(target, key);
}
function d1(target, key, descriptor) {
    console.log(target, key, descriptor);
}
function d2(target, key, descriptor) {
    console.log(target, key, descriptor);
}
class A {
    prop1;
    static prop2;
    method1() { }
    static method2() { }
}
__decorate([
    d0
], A.prototype, "prop1", void 0);
__decorate([
    d1
], A.prototype, "method1", null);
__decorate([
    d2
], A, "method2", null);
