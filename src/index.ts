import 'reflect-metadata';
// import { plainToInstance, plainToClassFromExist, classToPlain } from "class-transformer";

/*
class User {
  id: number;
  firstName: string;
  lastName: string;
  age: number;

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  isAdult() {
    return this.age >= 18 ? "成年人" : "未成年人";
  }
}

interface Result<T> {
  code: number;
  data: T[];
  msg: string;
}

class A {
  role: string;
}

const defineUser = new A();
defineUser.role = "hello"

const user = {
  id: 1,
  firstName: 'Joker',
  lastName: 'Jack',
  age: 19
}

// fetch如果想在nodejs中使用, 需要nodejs版本至少是18
fetch("https://mock.presstime.cn/mock/66d90ef5e084a6d52f2562b6/mock_ts/list")
  .then(res => res.json())
  .then((res: Result<User>) => {
    console.log(res.code);
    console.log(res.msg);

    const users = res.data;

    // 转换成前端User
    const us = plainToInstance(User, users);

    const us2 = plainToClassFromExist(defineUser, user);
    // console.log(us2);

    const us3 = classToPlain(User);
    // console.log(us3);

    console.log(us);

    // for (const u of us) {
    //   console.log(`${u.id} ${u.firstName}`);
    //   console.log(`${u.id} -- ${u.getFullName()} -- ${u.isAdult()}`)
    // }
  })
*/

// class validator
import { IsNotEmpty, Length, Min, Max, IsPhoneNumber, validate } from 'class-validator';

class User {
  @IsNotEmpty({ message: "账号不能为空" })
  @Length(3, 5, { message: "账号必须是3-5个字符长度" })
  loginId: string;

  @Min(9, { message: "年龄不能小于9岁" })
  @Max(90, { message: "年龄不能大于90岁" })
  age: number;

  @IsPhoneNumber("CN", { message: "手机号不正确" })
  tel: string;
}

const u = new User();
u.loginId = "Joker";
u.age = 19;
u.tel = "13232861709";

// 验证
validate(u).then(errors => {
  console.log(errors);
})