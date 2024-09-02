## 属性装饰器

属性装饰器也是一个函数，该函数至少需要两个参数

**参数一：**如果是静态属性，为类本身；如果是实例属性，为类的原型

**参数二：**字符串，表示属性名

```typescript
function d(target: any, key: string) { 
  console.log(target, key);
  console.log(target === A.prototype);
}

class A { 
  @d
  prop1: string;
  @d
  prop2: string;
}
```

当然，属性装饰器也能写成工厂模式：

```typescript
function d() {
  return function d(target: any, key: string) {
    console.log(target, key)
  }
}

class A {
  @d()
  prop1: string;
  @d()
  prop2: string;
}
```

也可以传值进去

```typescript
function d(value: string) { 
  return function d(target: any, key: string) { 
    target[key] = value;
  }
}

class A { 
  @d("hello")
  prop1: string;
  @d("world")
  prop2: string;
}

console.log(A.prototype);
```

**注意**，target是类的原型，因此这里赋值其实是赋值在类原型上的，而不是实例上。

**当属性为静态属性时，target得到的结果是A的构造函数**

```typescript
function d() {
  return function d(target: any, key: string) {
    console.log(target, key)
  }
}

class A {
  @d()
  prop1: string;
  @d()
  static prop2: string;
}
```

> **补充：**当你尝试通过装饰器给属性赋值时，它实际上是在原型上设置了这些值，这意味着所有实例将共享这些属性值，而不是每个实例拥有自己的独立值。
>
> 如果你要解决这个问题，你需要确保装饰器在每个类实例创建时为实例属性赋值。这通常是通过在构造函数中设置这些属性来完成的，但是由于装饰器不能直接访问类的构造函数，我们可以使用一点策略来解决。
>
> 下面的做法需要设置：`"noImplicitAny": false,`
>
> ```typescript
> function d(value: string) {
>  return function (target: any, key: string) {
>    if (!target.__initProperties) {
>      target.__initProperties = function () {
>        for (let prop in target.__props) {
>          this[prop] = target.__props[prop];
>        }
>      };
>      target.__props = {};
>    }
>    target.__props[key] = value;
>  };
> }
> 
> class A {
>  @d("hello")
>  prop1: string;
> 
>  @d("world")
>  prop2: string;
> 
>  constructor() {
>    if (typeof this["__initProperties"] === "function") {
>      this["__initProperties"]();
>    }
>  }
> }
> 
> const a = new A();
> console.log(a.prop1); // Output: "hello"
> console.log(a.prop2); // Output: "world"
> ```
