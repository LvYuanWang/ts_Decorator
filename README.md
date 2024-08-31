## 装饰器的本质

无论如何，在JS中，装饰器的本质是什么？虽然作用是提供元数据，但是并不是一个简单数据就能搞定的，因此**装饰器本身就是就是一个函数**，并且装饰器是属于JS的，并不是简简单单的TS的类型检查，是要参与运行的。

装饰器可以修饰：

- 类
- 成员（属性 + 方法）
- 参数

## tsconfig设置

由于现在装饰器没有正式形成规范，因此，在TS中使用装饰器，需要打开装饰器设置：

```typescript
"experimentalDecorators": true
```

## 类装饰器

类装饰器本质是一个函数，该函数接收一个参数，表示类本身（构造函数本身）

使用装饰器 `@` 得到一个函数

在TS中，构造函数的表示

- `Function`
- **`new (...args:any[]) => any`**

```typescript
// 定义为Function
function classDecoration(target: Function) { 
  console.log("classDecoration");
  console.log(target)
}
@classDecoration
class A { }
```

```typescript
// 定义为构造函数
function classDecoration(target: new (...args: any[]) => any) {
  console.log("classDecoration");
  console.log(target)
}
@classDecoration
class A { }
```

并且**构造器是在定义这个类的时候，就会运行**。而不是必须要等到你 `new` 对象的时候才会执行。

从执行之后的打印结果可以看出，target就是这个类本身：

```text
classDecoration
[class A]
```

上面的代码，我们编译之后，是下面的样子：

```javascript
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function classDecoration(target) {
    console.log("classDecoration");
}
let A = class A {
};
A = __decorate([
    classDecoration
], A);
```

其实通过编译之后的代码，就可以看到，直接运行了`__decorate`函数

### 泛型约束

我们之前讲过泛型构造函数，所以构造函数可以写成泛型的

```typescript
// 泛型类型别名
type constructor<T = any> = new (...args: any[]) => T;
function classDecoration(target: constructor) {
  console.log("classDecoration");
  console.log(target)
}
@classDecoration
class A { }
```

这样，我们可以通过泛型约束，对要使用装饰器的类进行约束了

```typescript
type constructor<T = any> = new (...args: any[]) => T;
type User = {
  id: number
  name: string
  info(): void
}

function classDecoration<T extends constructor<User>>(target: T) {
  console.log("classDecoration");
  console.log(target)
}
@classDecoration
class A { 
  constructor(public id: number, public name: string) { }
  info(){}
}
```

我们说装饰器其实是个函数，我们也能通过像函数那样调用，甚至传参，但是现在第一个参数target给固定限制了，该怎么处理呢？

### 装饰器工厂模式

我们可以**工厂模式**就能轻松解决这个问题，普通函数，返回一个装饰器函数就行了

```typescript
type constructor<T = any> = new (...args: any[]) => T;
function classDecorator<T extends constructor>(str: string) {
  console.log("普通方法的参数:" + str);
  return function (target: T) { 
    console.log("类装饰器" + str)  
  }
}

@classDecorator("hello")
class A { 
}
```

通过工厂模式既然能够返回一个函数，那么也能返回一个类，我们其实也能通过这种方式对原来的类进行修饰。

```typescript
type constructor<T = any> = new (...args: any[]) => T;

function classDecorator<T extends constructor>(target: T) {
  return class extends target {
    public newProperty = "new property";
    public hello = "override";
    info() {
      console.log("this is info");
    }
  };
}
@classDecorator
class A{ 
  public hello = "hello world";
}
const objA = new A();

console.log(objA.hello);
console.log((objA as any).newProperty); // 很明显，没有类型
(objA as any).info();
export {}
```

虽然可以这么做，但是很明显，返回的新的类，并不知道有新加的内容。

### 多装饰器

类装饰器不仅仅能写一个，还能写多个

```typescript
type constructor<T = any> = new (...args: any[]) => T;
function classDecorator1<T extends constructor>(str: string) {
  console.log("classDecorator1的参数:" + str);
  return function (target: T) { 
    console.log("classDecorator1类装饰器" + str)  
  }
}
function classDecorator2<T extends constructor>(str: string) {
  console.log("classDecorator2的参数:" + str);
  return function (target: T) { 
    console.log("classDecorator2类装饰器" + str)  
  }
}


@classDecorator1("1")
@classDecorator2("2")
class A { 
}
```

不过，注意执行之后的打印顺序：

```text
classDecorator1的参数:1
classDecorator2的参数:2
classDecorator2类装饰器2
classDecorator1类装饰器1
```

装饰器的执行很明显是**从下到上**的