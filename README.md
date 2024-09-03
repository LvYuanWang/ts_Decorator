## 访问器属性装饰器

**参数一：**类的原型(对象类型)

**参数二：**字符串，表示方法名

**参数三：** 属性描述对象，其实就是js的Object.defineProperty()中的属性描述对象{set:Function,get:Function, enumerable:xxx, configurable:xxx}

```typescript
function d(str: string) {
  return function d<T>(target: any, key: string, descriptor: TypedPropertyDescriptor<T>) {
    console.log(target, key)
    const temp = descriptor.set!;
    descriptor.set = function (value: T) {
      console.log("前置", str)
      temp.call(this, value);
      console.log("后置", str)
    }
  }
}

class User{
  public id: number;
  public name: string;
  private _age: number;

  @d("hello")
  set age(v: number) {
    console.log("set", v);
    this._age = v;
  }
}

const u = new User();
u.age = 10;
```

## 方法参数装饰器

方法参数几乎和属性装饰器一致，只是多了一个属性

**参数一：**如果是静态属性，为类本身；如果是实例属性，为类的原型

**参数二：**字符串，表示方法名

**参数三：**表示参数顺序

```typescript
function paramDecorator(target: any, key: string, index: number) { 
  console.log(target, key, index)
}

class A {
  method1(@paramDecorator id: number, @paramDecorator name: string) { 
    console.log("---", id, name)
  }
}

const objA = new A();
objA.method1(1, "hello");
```

当然，也能写成工厂模式

```typescript
function paramDecorator() { 
  return function(target: any, key: string, index: number) { 
    console.log(target, key, index)
  }
}

class A {
  method1(@paramDecorator() id: number, @paramDecorator() name: string) { 
    console.log("---", id, name)
  }
}

const objA = new A();
objA.method1(1, "hello");
```

我们稍微处理一下，在原型上加上属性看看效果：

```typescript
function paramDecorator(paramName: string) { 
  return function(target: any, key: string, index: number) { 
    !target.__params && (target.__params = {});
    target.__params[index] = paramName;
  }
}

class A {
  method1(@paramDecorator("id") id: number, @paramDecorator("name") name: string) { 
    console.log("---", id, name)
  }
}

const objA = new A();
console.log(A.prototype); // { __params: { '0': 'id', '1': 'name' } }
```
