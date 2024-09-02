// 属性装饰器
// 属性装饰器也是一个函数, 这个函数需要至少两个参数
// 参数一: 如果是实例属性, 参数一是类的原型对象; 如果是静态属性, 参数一为类的本身
// 参数二: 字符串类型, 表示属性名
/*
function d(target: any, key: string) {
  console.log(target, key);
  console.log(target === A.prototype)
}

class A {
  @d
  prop1: string;
  @d
  static prop2: string
}
*/

// 属性装饰器也可以使用工厂模式
/*
function d(str: string) {
  console.log(str);
  return function (target: any, key: string) {
    target[key] = str;  // 如果是实例属性, 这里str给到了原型属性上, 如果是静态属性, str给到了类本身
    console.log(target, key);
  }
}

class A {
  @d('hello')
  prop1: string;
  @d('world')
  static prop2: string;
}
console.log(A.prototype)
console.log(A)

const a = new A();
console.log(Object.keys(a));  // ['prop1']
console.log(Object.values(a));  // [undefined]
*/

// 实现装饰器将值赋值给实例对象的属性
function d(str: string) {
  return function (target: any, key: string) {
    if (!target.__initProperties) {
      target.__initProperties = function () {
        for (const prop in target.__props) {
          this[prop] = target.__props[prop];
        }
      };
      target.__props = {};
    }
    target.__props[key] = str;
  }
}

class A {
  @d('hello')
  prop1: string;
  @d('world')
  prop2: string;

  constructor() {
    // 判断有没有自己写的某个函数
    if (typeof this["__initProperties"] === "function") {
      this["__initProperties"]();
    }
  }
}

const a = new A();
console.log(a.prop1);
console.log(a.prop2);
console.log(Object.keys(a));