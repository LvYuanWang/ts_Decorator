/*
// classDecorator: 类装饰器
function classDecorator(value: Object) {
  return function (target: any) {
    console.log(value);
    console.log(target);
  }
}

// propertyDescriptor: 属性装饰器
function propertyDescriptor(value: string) {
  return function (target: any, key: string) {
    console.log(value);
    console.log(target, key);
  }
}

// methodDecorator: 方法装饰器
function methodDecorator(value: string) {
  return function (target: Record<string, any>, key: string, descriptor: PropertyDescriptor) {
    console.log(value);
    console.log(target, key, descriptor);
  }
}

@classDecorator(new A())
class A {
  @propertyDescriptor("hello")
  prop1: string = "aaa";

  @methodDecorator("method")
  method1() { }
}
*/


// 如果想要获取设置的装饰器里面的内容、值, 那就要使用第三方库来实现
// reflect-metadata
// 1. 安装reflect-metadata --> npm i reflect-metadata
// 2. tsconfig设置
// "experimentalDecorators": true /* 启用实验性装饰器的支持。 */
// "emitDecoratorMetadata": true /* 在源文件中为装饰器修饰的声明生成设计类型元数据。 */
// 3. 引入 reflect-metadata


// 基本语法
// 定义元数据 2种方式
// 1. 声明式定义: 需要放在具体定义的对象上
// @Reflect.metadata(metadataKey, metadataValue);


// 2. 命令式定义: 需要给定具体定义的参数
// Reflect.defineProperty(metadataKey, metadataValue, 定义元数据的对象, propertyKey?)


// 获取元数据
// Reflect.getMetadata(metadataKey, 定义元数据的对象): 返回metadataValue

import "reflect-metadata";

/*
// 声明式定义
@Reflect.metadata("classType", "B类-1")
class B {
  prop1: string
}

// 命令式定义
Reflect.defineMetadata("classType", "B类-2", B);

console.log(Reflect.getMetadata("classType", B));
*/

/*
// 同样也可以使用工厂模式 --> 声明式
const ClassTypeMetaKey = Symbol("classType");

function ClassType(type: string) {
  return Reflect.metadata(ClassTypeMetaKey, type);
}

@ClassType("B类-->声明式工厂")
class B {
  prop1: string
  method1() { }
}

console.log(Reflect.getMetadata(ClassTypeMetaKey, B));
*/

/*
// 命令式工厂模式
type Constructor<T = any> = new (...args: any[]) => T;

const ClassTypeMetaKey = Symbol("classType");

function ClassType(type: string) {
  return <T extends Constructor>(target: T) => {
    Reflect.defineMetadata(ClassTypeMetaKey, type, target);
  }
}

class B {
  prop1: string
  method1() { }
}

ClassType("B类-->命令式工厂")(B);

console.log(Reflect.getMetadata(ClassTypeMetaKey, B));
*/

/*
// 属性和方法的处理
class B {
  // @Reflect.metadata("propType1", "prop1-value")
  prop1: string;

  // @Reflect.metadata("propType2", "prop2-value")
  static prop2: string;

  @Reflect.metadata("methodType1", "method1-value")
  method1() { }

  @Reflect.metadata("methodType2", "method2-value")
  static method2() { }
}
// 命令式定义写法
Reflect.defineMetadata("propType1", "prop1-value", B.prototype, "prop1");
Reflect.defineMetadata("propType2", "prop2-value", B, "prop2");

console.log(Reflect.getMetadata("propType1", B.prototype, "prop1"));
console.log(Reflect.getMetadata("propType2", B, "prop2"));

console.log(Reflect.getMetadata("methodType1", B.prototype, "method1"));
console.log(Reflect.getMetadata("methodType2", B, "method2"));
*/


const formatMetadataKey = Symbol("format");

function format(str: string) {
  return Reflect.metadata(formatMetadataKey, str);
}

function getFormat(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}

class Greeter {
  @format("Hello, %s")
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  greet() {
    let formatString = getFormat(this, "greeting");
    return formatString.replace("%s", this.greeting);
  }
}

const objG = new Greeter("Joker");
console.log(objG.greet());  // Hello, Joker

function greet(target: any, propertyKey: string) {
  let formatString = getFormat(target, propertyKey);
  return formatString.replace("%s", target[propertyKey]);
}

const g = greet(objG, "greeting");
console.log(g); // Hello, Joker


// 官网案例
class Point {
  constructor(public x: number, public y: number) { }
}

class User {
  constructor(public x: number, public y: number) { }
}

class Line {
  private _start: Point;
  private _end: Point;

  @validate
  @Reflect.metadata("design:type", Point)
  set start(value: Point) {
    this._start = value;
  }

  get start() {
    return this._start;
  }

  @validate
  @Reflect.metadata("design:type", Point)
  set end(value: Point) {
    this._end = value;
  }

  get end() {
    return this._end;
  }
}

function validate<T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
  let set = descriptor.set!;

  descriptor.set = function (value: T) {
    let type = Reflect.getMetadata("design:type", target, propertyKey);

    if (!(value instanceof type)) {
      throw new TypeError(`Invalid type, got ${typeof value} not ${type.name}.`);
    }

    set.call(this, value);
  };
}

const line = new Line()
// line.start = new Point(0, 0)
line.start = new User(0, 0);  // 这里不是Point类型, 会抛出TypeError