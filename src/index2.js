// 组件接口
class TextMessage {
  constructor(message) {
    this.message = message;
  }

  getText() {
    return this.message;
  }
}

// 使用闭包高阶函数 --> HTML装饰器
function HTMLDecorator(textMessage) {
  return class extends textMessage {
    getText() {
      const msg = super.getText();
      return `<div>${msg}</div>`;
    }
  }
}

// 使用闭包高阶函数 --> 加密装饰器
function EncryptDecorator(textMessage) {
  return class extends textMessage {
    getText() {
      const msg = super.getText();
      return this.encrypt(msg);
    }
    encrypt(msg) {
      return btoa(msg);
    }
  }
}

// 使用闭包高阶函数 --> 解密装饰器
function DecryptDecorator(textMessage) {
  return class extends textMessage {
    getText() {
      const msg = super.getText();
      return this.decrypt(msg);
    }
    decrypt(msg) {
      return atob(msg);
    }
  }
}

// 使用装饰器
let DecoratorClass = HTMLDecorator(TextMessage);
let message = new DecoratorClass('Hello ClosureHighFunction').getText();

let EncryptMessage = EncryptDecorator(TextMessage);
const encryptMessage = new EncryptMessage(message).getText();
let DecryptMessage = DecryptDecorator(TextMessage);
const decryptMessage = new DecryptMessage(encryptMessage).getText();

console.log(`encryptMessage: ${encryptMessage} --> decryptMessage: ${decryptMessage}`);