## 理解装饰器

**装饰器（Decorator）**其实是面向对象中的概念，在一些纯粹的面向对象的类型语言中早就有装饰器的内容了，在**java**中叫**注解**，在**C#**中叫**特征**。装饰器并不是Typescript新引出的概念，是JavaScript本身就支持的内容。而且，出来的还特别早，在ES6的时候，就已经提出了装饰器。只不过，将近10年过去了，装饰器的规范几乎从头开始重写了好几次，但它还没有成为规范的一部分。到现在，2024年，也才刚刚进展到第3阶段不久

前些年随着面向对象语言的流行，JavaScript的装饰器也一直备受期待，不过由于 JavaScript 不是仅仅局限于基于浏览器的应用程序，规范的制定者必须考虑到可以执行 JavaScript 的各种平台上javascript上执行的情况，规范也迟迟未定下来。

不过世事变迁，现在纯前端的框架也来到了react18，vue3的时代，这两个框架都倾向于使用更加模块化和函数式的编程风格。这种风格更有利于实现摇树优化（Tree Shaking），这是现代前端构建工具（如 Webpack、Rollup）中的一个关键特性

不过Angular 就一直在广泛使用装饰器，还有nodejs流行的后端框架NestJS对装饰器也有很好的支持

无论怎么样，装饰器理论是很优秀的，对于我们对整个程序设计的理解是有帮助的。

### 装饰器模式

其实在程序设计中，一直有[装饰器模式](https://refactoringguru.cn/design-patterns/decorator)，它一种结构设计模式，通过将对象置于包含行为的特殊包装器对象中，可以将新的行为附加到对象上

```javascript
// 组件接口
class TextMessage {
  constructor(message) {
    this.message = message;
  }

  getText() {
    return this.message;
  }
}

// 装饰器基类
class MessageDecorator {
  constructor(textMessage) {
    this.textMessage = textMessage;
  }

  getText() {
    return this.textMessage.getText();
  }
}

// 具体装饰器
class HTMLDecorator extends MessageDecorator {
  getText() {
    const msg = super.getText();
    return `<p>${msg}</p>`;
  }
}

class EncryptDecorator extends MessageDecorator {
  getText() {
    const msg = super.getText();
    // 加密逻辑
    return this.encrypt(msg);
  }
  encrypt(msg) {
    return msg.split("").reverse().join("");
  }
}

// 使用
let message = new TextMessage("Hello World");
message = new HTMLDecorator(message);
message = new EncryptDecorator(message);

console.log(message.getText()); // 输出加密的 HTML 格式文本

```

这是面向对象的写法，其实在js中，我们也能写成函数式的，因为上面的写法，我们完全可以使用高阶函数替代

```javascript
// 基础消息类
class TextMessage {
  constructor(message) {
    this.message = message;
  }

  getText() {
    return this.message;
  }
}

// 高阶函数 - HTML装饰器
function HtmlDecoratedClass(BaseClass) {
  return class extends BaseClass {
    getText() {
      const originalText = super.getText();
      return `<p>${originalText}</p>`;
    }
  };
}

// 高阶函数 - 加密装饰器
function EncryptDecoratedClass(BaseClass) {
  return class extends BaseClass {
    getText() {
      const originalText = super.getText();
      // 这里应该是你的加密逻辑
      return this.encrypt(originalText);
    }
    encrypt(msg) {
      // 简单处理加密
      return msg.split("").reverse().join("");
    }
  };
}

// 使用装饰器
let DecoratedClass = HtmlDecoratedClass(TextMessage);
DecoratedClass = EncryptDecoratedClass(DecoratedClass);

const messageInstance = new DecoratedClass("Hello World");
console.log(messageInstance.getText()); // 输出被 HTML 格式化并加密的文本
```

### 装饰器的作用

这样很简单的实现了装饰器的设计模式，但是这样的代码实际上在工作中还是有一些问题，比如我们创建一个用户，然后可能在后期，我们需要对用户中的数据进行验证：

```typescript
class User { 
  // 注意：严格检查(strict)不赋初始值会报错
  // 演示可以设置 strictPropertyInitialization: false
  loginId: string; // 必须是3-5个字符
  loginPwd: string; // 必须是6-12个字符
  age: number; // 必须是0-100之间的数字
  gender: "男" | "女";
}

const u = new User();

// 对用户对象的数据进行验证
function validateUser(user: User) { 
  // 对账号进行验证
  // 对密码进行验证
  // 对年龄进行验证
  // ...
}
```

这实际上，是要求对类的属性都需要进行处理，是不是就要进行装饰。我们下面的`validateUser`这个函数，实际就在处理这个问题。这咋一看没有什么问题，但是，其实应该在我们写类，写属性的时候，对这个属性应该怎么处理才是最了解的。而不是当需要验证的时候，再写函数进行处理。

当然，你可能会说，把`validateUser`这个函数写到类中去不就行了？

```typescript
class User { 
  // 注意：严格检查(strict)不赋初始值会报错
  // 演示可以设置 strictPropertyInitialization: false
  loginId: string; // 必须是3-5个字符
  loginPwd: string; // 必须是6-12个字符
  age: number; // 必须是0-100之间的数字
  gender: "男" | "女";

  validate() { 
    // 对账号进行验证
    // 对密码进行验证
    // 对年龄进行验证
    // ...
  }
}
```

可以，但是并没有解决我们提出的问题：当我们写这个类的属性的时候，对这个属性应该是最了解的。如果我们能在写属性的时候，就直接可以定义这些验证是最舒服的。

还有一个问题，现在仅仅是User这个类，那么我们还有其他的类需要验证，也是差不多的验证长度啊，是不是必须得啊，对这个属性的描述是什么啊，这些都需要。那我们肯定在另外一个类中，还需要来上`validate`函数这一套。能不能有一种语法机制，帮我们处理这个问题呢？

装饰器就可以帮我们解决这些问题

**1、关注点分离**：写属性，然后再写函数处理，其实就分离了我们的关注点

**2、代码重复**：不同的类可能只是属性不一样，但是可能需要验证，分析或者处理的内容实际上差不多

**伪代码**

```typescript
class User { 
  @required
  @range(3, 5) 
  @description("账号")  
  loginId: string; // 中文描述：账号，验证：1.必填 2.必须是3-5个字符
  ......
}
```



这两个**问题产生的根源其实就是我们在定义某些信息的时候，能够附加的信息有限，如果能给这些信息装饰一下，添加上有用的信息，就能处理了，这就是装饰器**

所以**装饰器的作用：为某些属性、类、方法、参数提供元数据信息(metadata)**

又来一个名词：

**元数据：描述数据的数据**，上面的伪代码中，这三个装饰器`@required` `@range(3, 5)` `@description("账号")` 其实就是用来描述loginId这么一个数据的。其实meta这个词，我们早就见过，在`html`中，`meta`标签就是用来描述这个html文档信息的

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- 文档编码 -->
  <meta charset="UTF-8">
  <!-- 视口尺寸 -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
</body>
</html>
```

还有著名的公司`Facebook`，改了名字，叫`Meta`，你就知道这个公司名真正的含义了