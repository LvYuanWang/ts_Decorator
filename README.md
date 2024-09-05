## [class-transformer](https://www.npmjs.com/package/class-transformer)

给大家介绍两个基于[reflect-metadata](https://www.npmjs.com/package/reflect-metadata)元数据实现的比较有用的功能库

[class-transformer](https://www.npmjs.com/package/class-transformer)可以很方便的将普通对象转换为类的某些实例，这个功能在某一些时候非常好用。

比如我们在很多时候，从后端获取的数据，都是一些简单的json格式的数据，有些数据可能需要经过前端的再处理，如下：

```json
{
  "id": 1,
  "firstName": "Nancy",
  "lastName": "Lopez",
  "age": 35
}
```

为了简单方便，可以使用远程的mock模拟数据，比如[easy mock](https://mock.mengxuegu.com/login)，直接简单登录之后即可使用，使用过程就两步：

1、创建项目

2、创建接口

再复杂一点的时候可以自己去阅读网站的文档

我们可以创建如下的简单数据

```json
{
  code: 200,
  "data|10": [{
    "id|+1": 1,
    "firstName": "@first",
    "lastName": "@last",
    "age|9-45": 1
  }],
  msg: "成功"
}
```

从后端获取的是上面的数据，可能前端还需要一些功能，比如获取全名，比如判断是否成年，我们可以创建一个类进行封装处理

```typescript
class User { 
  id: number
  firstName: string
  lastName: string
  age: number
  
  getFullName() { 
    return this.firstName + " "+ this.lastName;
  }

  isAdult() { 
    return this.age > 18 ? "成年人" : "未成年人";
  }
}

// 模拟数据返回格式
interface Result<T> {
  code: number;
  data: T;
  msg: string
}
```

这在我们获取数据的时候，**如果直接获取的就是简单json数据，倒是没什么影响，但是不能访问自己封装的函数**

```typescript
fetch("https://mock.mengxuegu.com/mock/65b1f3d1c4cd67421b34cd0c/mock_ts/list")
  .then(res => res.json())
  .then( (res:Result<User[]>) => { 
    console.log(res.code);
    console.log(res.msg);

    const users = res.data;

    for (const u of users) {
      console.log(u.id + " " + u.firstName);
      // console.log(u.id + " " + u.getFullName() + " " + u.isAdult()); //error
    }
  })
```

这里，就可以使用`class-transformer`它可以自动的将数据和我们封装的类进行映射，使用也非常的简单

```typescript
import "reflect-metadata"
import { plainToInstance } from 'class-transformer';

fetch("https://mock.mengxuegu.com/mock/65b1f3d1c4cd67421b34cd0c/mock_ts/list")
  .then(res => res.json())
  .then( (res:Result<User[]>) => { 
    console.log(res.code);
    console.log(res.msg);

    const users = res.data;
    const us = plainToInstance(User, users);

    for (const u of us) {
      // console.log(u.id + " " + u.firstName);
      console.log(u.id + " " + u.getFullName() + " " + u.isAdult());
    }
  })
```

这样就正常的获取了User类所修饰的内容

## [class-validator](https://www.npmjs.com/package/class-validator)

这个库同样是基于[reflect-metadata](https://www.npmjs.com/package/reflect-metadata)元数据实现的比较有用的功能库，通过名字大家就知道，这个库可以用来对类进行验证

这个库使用也非常的简单，基本也就知晓两步就ok

1、相关装饰器的绑定

2、验证方法的调用

```typescript
import "reflect-metadata";
import { validate, IsNotEmpty, Length, Min, Max, IsPhoneNumber } from "class-validator";

class User {
  @IsNotEmpty({ message: "账号不能为空" })
  @Length(3, 5, { message: "账号必须是3-5个字符" })
  loginId: string; 

  @Min(9)
  @Max(45)  
  age: number;

  @IsPhoneNumber("CN")
  tel: string;
}

const u = new User();

validate(u).then(errors => { 
  console.log(errors)
})
```
