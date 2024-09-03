## 方法装饰器

方法装饰器也是一个函数，该函数至少需要三个参数

**参数一：**如果是静态方法，为类本身*(类构造函数类型)*；如果是实例方法，为类的原型*(对象类型)*

**参数二：**字符串，表示方法名

**参数三：**属性描述对象，*其实就是js的Object.defineProperty()中的属性描述对象{value:xxx,writable:xxx, enumerable:xxx, configurable:xxx}*

上节课属性不是也讲过参数一也是这种情况吗？如果非要区分开静态方法和实例方法，其实分开设置也行：

```typescript
function d0() {
  return function d(target: Record<string,any>, key: string) {
    console.log(target, key)
  }
}
function d1() {
  return function d(target: Record<string,any>, key: string, descriptor: PropertyDescriptor) {
    console.log(target, key, descriptor)
  }
}
function d2() {
  return function d(target: new (...args:any[])=>any, key: string, descriptor: PropertyDescriptor) {
    console.log(target, key, descriptor)
  }
}

class A {
  @d0()
  prop1: string;
  prop2: string;
  @d1()
  method1() { }
  @d2()
  static method2() { }
}
```

为了减少讲解的麻烦，这里还是直接用any

```typescript
function d() {
  return function d(target: any, key: string, descriptor: PropertyDescriptor) {
    console.log(target, key, descriptor)
  }
}

class A {
  prop1: string;
  prop2: string;
  @d()
  method1(){}
}

const objA = new A();

for(let prop in objA){
  console.log(prop)
}
```

结果：

```shell
{} method1 {
  value: [Function: method1],
  writable: true,
  enumerable: false,
  configurable: true
}
prop1
prop2
```

通过结果可以看到，方法默认并没有遍历，因为`enumerable: false`，那我们完全可以通过属性描述符进行修改

```typescript
function enumerable() {
  return function d(target: any, key: string, descriptor: PropertyDescriptor) {
    console.log(target, key, descriptor)
    descriptor.enumerable = true;
  }
}

class A {
  prop1: string;
  prop2: string;
  @enumerable()
  method1(){}
}

const objA = new A();

for(let prop in objA){
  console.log(prop)
}
```

既然可以这么做，那么我们的操作性就大大增加了，比如我们完全可以修改属性描述符的value值，让其变为执行其他的内容

```typescript
function enumerable() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    console.log(target, key, descriptor)
    descriptor.enumerable = true;
  }
}

// 被废弃的方法
function noUse() { 
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    descriptor.value = function () { 
      console.log("被废弃的方法");
    }
  }
}

class A {
  prop1: string;
  prop2: string;
  @enumerable()
  method1() { }
  
  @enumerable()
  @noUse()  
  method2() {
    console.log("正常执行......")
  }
}

const objA = new A();

for(let prop in objA){
  console.log(prop)
}
// 执行被废弃的方法
objA.method2();
```

甚至于，我们还能实现方法的拦截器

```typescript
function enumerable() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    console.log(target, key, descriptor)
    descriptor.enumerable = true;
  }
}

// 被废弃的方法
function noUse() { 
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    descriptor.value = function () { 
      console.log("被废弃的方法");
    }
  }
}

function interceptor(str: string) { 
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const temp = descriptor.value;
    descriptor.value = function (...args: any[]) { 
      console.log("前置拦截---" + str);
      temp.call(this, args);
      console.log("后置拦截---" + str);
    }
  }
}

class A {
  prop1: string;
  prop2: string;
  @enumerable()
  method1() { }
  
  @enumerable()
  @noUse()  
  method2() {
    console.log("正常执行......")
  }

  @enumerable()
  @interceptor("interceptor")
  method3(str: string) {
    console.log("正在执行 method3:" + str)
  }
}

const objA = new A();

for(let prop in objA){
  console.log(prop)
}
// 执行被废弃的方法
objA.method2();

// 拦截
objA.method3("hello world");
```
