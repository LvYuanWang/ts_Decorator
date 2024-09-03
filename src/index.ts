// 方法装饰器
// 参数一: 如果是实例方法, 为类的原型(对象类型)。如果是静态方法, 为类本身(类构造函数类型)
// 参数二: 字符串, 表示方法名
// 参数三: 属性描述对象, 其实就是js的Object.defineProperty()中的属性描述对象{value: xxx, writable: xxx, enumerable: xxx, configurable: xxx}
/*
function d0(target: Record<string, any>, key: string) {
  console.log(target, key)
}

function d1(target: Record<string, any>, key: string, descriptor: PropertyDescriptor) {
  console.log(target, key, descriptor)
}

function d2(target: new (...args: any[]) => any, key: string, descriptor: PropertyDescriptor) {
  console.log(target, key, descriptor)
}

class A {
  @d0
  prop1: string;
  static prop2: string;

  @d1
  method1() { }

  @d2
  static method2() { }
}
*/

// 工厂模式写法
// 允许迭代装饰器
function enumerable() {
  return function (target: Record<string, any>, key: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = true;
    console.log(target, key, descriptor);
  }
}

// 废弃方法装饰器
function noUse(date: string) {
  return function (target: Record<string, any>, key: string, descriptor: PropertyDescriptor) {
    descriptor.value = function () {
      console.log(`该方法于${date}已经废弃...`);
    }
  }
}

// 拦截方法装饰器
function interceptor(interceptorFormer: string, interceptorAfter: string) {
  return function (target: Record<string, any>, key: string, descriptor: PropertyDescriptor) {
    const temp = descriptor.value;
    descriptor.value = function (...args: any[]) {
      console.log(`拦截前的操作 --> ${interceptorFormer}`);
      temp.call(this, ...args);
      console.log(`拦截后的操作 --> ${interceptorAfter}`);
    }
  }
}

class A {
  prop1: string;
  prop2: string;

  @enumerable()
  method1() { }

  @enumerable()
  @noUse("2024-9-1")
  method2() {
    console.log('method2方法执行');
  }

  @enumerable()
  @interceptor("开始执行method3方法", "method3方法执行完毕")
  method3(str: string) {
    console.log(`执行method3方法 --> ${str}`)
  }
}

console.log("--> 打印对象属性和方法 <--")
const objA = new A();
for (let prop in objA) {
  console.log(prop);
}
objA.method2();
objA.method3("hello");