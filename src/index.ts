// 装饰器的作用: 为某些属性, 方法(方法参数), 类提供元数据信息(metadata)
// 元数据: 描述数据的数据
// 装饰器的本质其实就是一个函数
// 装饰器是JS的内容, 是需要参与运行的

// 由于装饰器还没有形成正式规范, 所以在TS中需要打开配置experimentalDecorators: true

// 修饰类需要构造函数类型
// 1. 简单的使用Function
// 2. new (...args: any[]) => any
// function classDecoration(target: new (...args: any[]) => any) {
//   console.log('classDecoration');
//   console.log('target:', target);
//   target.prototype.name = 'Joker';
// }

// @classDecoration
// class A { }

// const a = new A();
// console.log((a as any).name); // Joker

// 使用泛型约束
/*
type constructor<T = any> = new (...args: any[]) => T;

type User = {
  id: number;
  name: string;
  info(): void;
}

function classDecoration<T extends constructor<User>>(target: T) {
  console.log('classDecoration');
  console.log('target:', target);
  target.prototype.age = 19;
}

@classDecoration
class A {
  constructor(public id: number, public name: string) { }
  info() {
    console.log('info', this.id, this.name, (this as any).age);
  }
}

let a = new A(1, 'Joker');
a.info();
*/

// 装饰器工厂: 返回一个装饰器
/*
type constructor<T = any> = new (...args: any[]) => T;
function classDecorator<T extends constructor>(str: string) {
  console.log(`这里其实就是普通方法: ${str}`);
  return function (target: T) {
    console.log('classDecorator');
    console.log('target:', target);
    console.log(`这里是类装饰器: ${str}`);
    target.prototype.name = str;
  }
}

@classDecorator('Jack')
class A { }

let a = new A();
console.log((a as any).name); // Jack
*/

// 如果是返回一个类呢
type constructor<T = any> = new (...args: any[]) => T;

/*
function classDecorator<T extends constructor>(target: T) {
  return class extends target {
    name = 'Joker';
    newProperty = 'new property';
    hello = 'override';
    info() {
      console.log('info', this.name, this.newProperty, this.hello);
    }
    show() {
      console.log('This is show method');
    }
  }
}

@classDecorator
class A {
  name = "Jack";
  show() {
    console.log('show')
  }
}

let a = new A();
console.log(a.name); // Joker
a.show(); // This is show method
(a as any).info(); // info Joker new property override
*/

// 多装饰器
// 普通函数按照顺序执行
// 装饰器按照从下到上, 从内到外执行
function classDecorator1<T extends constructor>(str: string) {
  console.log('classDecorator1函数的参数: ', str);
  return function (target: T) {
    console.log('classDecorator1类装饰器: ', str);
  }
}

function classDecorator2<T extends constructor>(str: string) {
  console.log('classDecorator2函数的参数: ', str);
  return function (target: T) {
    console.log('classDecorator2类装饰器: ', str);
  }
}

// 先执行classDecorator1, 再执行classDecorator2, 从上到下执行, 从外到内执行
// 如果有返回则从下到上执行
@classDecorator1('Jack')
@classDecorator2('Joker')
class A { }
/* 
输出结果:
classDecorator1函数的参数:  Jack
classDecorator2函数的参数:  Joker
classDecorator2类装饰器:  Joker
classDecorator1类装饰器:  Jack
*/