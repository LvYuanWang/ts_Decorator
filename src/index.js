// 组件接口
class TextMessage {
  constructor(message) {
    this.message = message;
  }

  getText() {
    return this.message;
  }
}

// 装饰器的基类
class MessageDecorator {
  constructor(textMessage) {
    this.textMessage = textMessage;
  }

  getText() {
    return this.textMessage.getText();
  }
}

// 具体装饰器子类 --> HTML装饰器
class HTMLDecorator extends MessageDecorator {
  getText() {
    const msg = super.getText();
    return `<p>${msg}</p>`;
  }
}

// 具体装饰器子类 --> 加密装饰器
class EncryptDecorator extends MessageDecorator {
  getText() {
    const msg = super.getText();
    return this.encrypt(msg);
  }
  encrypt(msg) {
    return btoa(msg);
  }
}

// 具体装饰器子类 --> 解密装饰器
class DecryptDecorator extends MessageDecorator {
  getText() {
    const msg = super.getText();
    return this.decrypt(msg);
  }
  decrypt(msg) {
    return atob(msg);
  }
}

// 使用装饰器
let message = new TextMessage('Hello World');
message = new HTMLDecorator(message);

let encryptMessage = new EncryptDecorator(message);
encryptMessage = encryptMessage.getText();
let decryptMessage = new DecryptDecorator(new TextMessage(encryptMessage));
decryptMessage = decryptMessage.getText();

console.log(`encryptMessage: ${encryptMessage} --> decryptMessage: ${decryptMessage}`);