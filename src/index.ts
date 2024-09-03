// 方法装饰器
// 参数一: 如果是实例方法, 为类的原型(对象类型)。如果是静态方法, 为类本身(类构造函数类型)
// 参数二: 字符串, 表示方法名
// 参数三: 属性描述对象, 其实就是js的Object.defineProperty()中的属性描述对象{set: Function, git: Function, enumerable: xxx, configurable: xxx}

// descriptor: PropertyDescriptor
// function d(str: string) {
//   return function (target: Record<string, any>, key: string, descriptor: PropertyDescriptor) {
//     const temp = descriptor.set!;
//     descriptor.set = function (...args: any[]) {
//       console.log(`前置 --> ${str}`);
//       temp.call(this, args);
//       console.log(`后置 --> ${str}`)
//     }
//   }
// }

/*
// descriptor也可以使用带泛型参数的类型TypedPropertyDescriptor<T>
function d(str: string) {
  return function <T>(target: Record<string, any>, key: string, descriptor: TypedPropertyDescriptor<T>) {
    const temp = descriptor.set!;
    descriptor.set = function (value: T) {
      console.log(`前置 --> ${str}`);
      temp.call(this, value);
      console.log(`后置 --> ${str}`)
    }
  }
}

class User {
  public id: number;
  public name: string;
  private _age: number;

  // @d()
  // method1() { }

  @d("hello")
  set age(value: number) {
    console.log(`set age --> ${value}`)
    this._age = value;
  }

  get age() {
    return this._age;
  }
}

const u = new User();
u.age = 10;
*/

// 方法参数装饰器
// 参数一: 如果是静态方法, 为类本身; 如果是实例属性, 为类原型;
// 参数二: 字符串, 表示方法名
// 参数三: 数字, 表示参数顺序

// function parameterDecorator(target: any, key: string, index: number) {
//   console.log(target, key, index);
// }

// 工厂模式
function parameterDecorator(propertyName: string) {
  return function (target: any, key: string, index: number) {
    console.log(target, key, index);
    !target._prop && (target._prop = {});
    target._prop[index] = propertyName;
  }
}

class A {
  method1(@parameterDecorator("id") id: number, @parameterDecorator("name") name: string) {
    console.log(id, name)
  }

  static method2(@parameterDecorator("name") name: string, @parameterDecorator("age") age: number) {
    console.log(name, age)
  }
}

const objA = new A();
objA.method1(1, "Joker");
console.log(A.prototype);
console.log(A);