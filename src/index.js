"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function d(str) {
    return function (target, key) {
        if (!target.__initProperties) {
            target.__initProperties = function () {
                for (const prop in target.__props) {
                    this[prop] = target.__props[prop];
                }
            };
            target.__props = {};
        }
        target.__props[key] = str;
    };
}
class A {
    prop1;
    prop2;
    constructor() {
        if (typeof this["__initProperties"] === "function") {
            this["__initProperties"]();
        }
    }
}
__decorate([
    d('hello')
], A.prototype, "prop1", void 0);
__decorate([
    d('world')
], A.prototype, "prop2", void 0);
const a = new A();
console.log(a.prop1);
console.log(a.prop2);
console.log(Object.keys(a));
