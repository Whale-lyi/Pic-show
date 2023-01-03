# 登陆注册

## 效果展示

> 具体实现可看第二部分

数据库脚本见 web_2022.sql, 创建数据库

进入项目后，在终端输入

```bash
npm install
node ./app.js
```

启动项目后，浏览器打开 http://127.0.0.1:8080/, 进入登录页

### 2.1 登录

![image-20230104004223617](https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230104004223617.png)

- 邮箱、密码、验证码如果输入正确，会跳转到一级页面(见2.4)
- **点击图形验证码时会自动刷新**，为方便用户输入，不区分大小写
- 手机号与第三方登录并未实现

- 如果信息有误，处理见下表

| 错误类型       | 提示                                                         |
| -------------- | ------------------------------------------------------------ |
| 邮箱或密码为空 | <img src="https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230102184447104.png" alt="image-20230102184447104" style="zoom:80%;" /> |
| 邮箱未注册     | <img src="https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230102184654394.png" alt="image-20230102184654394" style="zoom:80%;" /> |
| 密码错误       | <img src="https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230102184721735.png" alt="image-20230102184721735" style="zoom:80%;" /> |
| 验证码错误     | <img src="https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230102184817679.png" alt="image-20230102184817679" style="zoom:80%;" /> |
| 邮箱格式不符   | <img src="https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230102200228130.png" alt="image-20230102200228130" style="zoom:80%;" /> |

### 2.2 注册

![image-20230102221101641](https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230102221101641.png)

- 邮箱、密码、验证密码如果输入正确，会跳转到登陆页面

- 用户输入密码会提示密码强度，如下表所示(评分细则见第三部分实现)

  | 分类            | 示例                                                         |
  | --------------- | ------------------------------------------------------------ |
  | Secure(>=70分)  | <img src="https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230102213841397.png" alt="image-20230102213841397" style="zoom:80%;" /> |
  | Average(>=50分) | <img src="https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230102213931469.png" alt="image-20230102213931469" style="zoom:80%;" /> |
  | Weak(>=0分)     | <img src="https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230102214024312.png" alt="image-20230102214024312" style="zoom:80%;" /> |

- 如果信息有误，处理见下表

  | 错误           | 提示                                                         |
  | -------------- | ------------------------------------------------------------ |
  | 邮箱或密码为空 | <img src="https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230102184447104.png" alt="image-20230102184447104" style="zoom:80%;" /> |
  | 邮箱已注册     | <img src="https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230104004337422.png" alt="image-20230104004337422" style="zoom:80%;" /> |
  | 邮箱格式不符   | <img src="https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230102200228130.png" alt="image-20230102200228130" style="zoom:80%;" /> |
  | 两次密码不一致 | <img src="https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230102214944820.png" alt="image-20230102214944820" style="zoom:80%;" /> |

### 2.3 鉴权

用户未登录时，只允许访问

- 登录页
  - http://127.0.0.1:8080/  (会重定向到/login)
  - http://127.0.0.1:8080/login
- 注册页
  - http://127.0.0.1:8080/register

访问一级页面或二级页面，会因为鉴权失败而无法访问 (打开这些网页时会**自动向后端发送权限检查的请求**(/check)) 

<img src="https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230102185320025.png" alt="image-20230102185320025"  />

### 2.4 显示个人信息，注销

一级页面:

- 一级页面可以点击右下方按钮进行主题切换
- 点击右上方 Log off 按钮会注销并回到登录页

![image-20230104004004499](https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230104004004499.png)

二级页面:

- 显示原图，可见水印，频域水印图片

![image-20230104003921495](https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230104003921495.png)

## 具体实现

后端使用 `express@4.18.2`

一些基本结构

```js
const express = require('express')
const cors = require('cors')
const apiRouter = require('./apiRouter')
const router = require('./router')
const config = require('./config')
const {expressjwt: jwt} = require("express-jwt");

const app = express()

app.use(cors())
// 配置解析表单数据中间件, 解析 application/x-www-form-urlencoded 格式
app.use(express.urlencoded({ extended: false }))
// 处理静态资源
app.use(express.static('public'))
// 鉴权接口
app.use('/check', jwt({ secret: config.jwtSecretKey, algorithms: ["HS256"] }))
// api路由与跳转路由
app.use('/api', apiRouter)
app.use(router)
// 处理错误
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        return res.send({status: 1, message: '身份认证失败'})
    }
})
// 监听8080端口
app.listen(8080, () => {
    console.log('api server running at http://127.0.0.1:8080')
})
```

### 3.1 登录

#### 3.1.1 检查邮箱格式是否合法

```js
let emailCheck = true
let input = document.getElementsByTagName('input')[0]
input.onkeyup = function () {
    let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    let span0 = document.getElementsByTagName('span')[0]
    if (!reg.test(this.value)) {
        span0.innerHTML = '请输入邮箱'
        emailCheck = false
    } else {
        span0.innerHTML = ''
        emailCheck = true
    }
}
```

#### 3.1.2 登录请求

> 重点:
>
> - 使用 jQuery 发送 ajax 请求
>
> - 密码传输前进行加密
>
> - 登陆成功后使用 localStorage 存储 token 与 email

```js
function login() {
    const salt = '201250141ly'
    let inputs = document.getElementsByTagName('input')
    let email = inputs[0].value
    let password = inputs[1].value
    if (!email || !password) {
        alert('用户名或密码不能为空')
    } else if (!emailCheck) {
        // 邮箱格式不合法
    } else {
        let span0 = document.getElementsByTagName('span')[0]
        let span1 = document.getElementsByTagName('span')[1]
        let span3 = document.getElementsByTagName('span')[3]
        // 对密码进行加密
        password = window.btoa(window.btoa(password + salt) + salt);
        if (check(inputs[2].value)) {
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8080/api/login',
                data: {
                    email: email,
                    password: password
                },
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'json',
                success: function (data) {
                    if (data.status === 0) {
                        localStorage.setItem('token', data.token)
                        localStorage.setItem('email', data.email)
                        window.location.href = 'http://localhost:8080/main'
                    } else if (data.status === 100) {
                        // 邮箱未注册
                        span0.innerHTML = '邮箱未注册'
                        span1.innerHTML = ''
                        span3.innerHTML = ''
                    } else if (data.status === 101) {
                        // 密码错误
                        span1.innerHTML = '密码错误'
                        span0.innerHTML = ''
                        span3.innerHTML = ''
                    } else {
                        alert(data)
                    }
                },
                error: function (data) {
                    console.log('出错了')
                }
            })
        } else {
            // 验证码错误
            span0.innerHTML = ''
            span1.innerHTML = ''
            span3.innerHTML = '验证码错误'
        }
    }
}
```

#### 3.1.3 后端登录接口

```js
// 登录
apiRouter.post('/login', (req, res) => {
    const userInfo = req.body
    // 查询数据库
    const sql = 'select * from user where email = ?'
    db.query(sql, userInfo.email, function (err, results) {
        if (err) {
            return res.send({status: 1, message: err.message})
        }
        if (results.length !== 1) {
            return res.send({status: 100, message: '邮箱未注册'})
        }
        // 调用 bcrypt.compareSync()方法比较密码是否一致
        const boolRes = bcrypt.compareSync(userInfo.password, results[0].pwd)
        if (!boolRes) {
            return res.send({status: 101, message: '密码错误'})
        }
        // 登陆成功, 生成 JWT
        const user = { ...results[0], pwd: ''}
        const token = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '5h' // token 有效期为5小时
        })
        // 将token响应给客户端
        res.send({
            status: 0,
            message: '登陆成功',
            token: 'Bearer ' + token,
            email: userInfo.email
        })
    })
})
```

### 3.2 注册

#### 3.2.1 密码强度提示

规则见 https://zhuanlan.zhihu.com/p/25545606

简单来说就是根据不同的规则判断获取多少分数，通过最后的总分判断密码强度

代码如下，使用正则表达式来匹配输入的密码，获取到 大小写字母，数字，特殊字符 是否出现以及出现多少次。以此判断是否符合规则

```js
let password = document.getElementsByTagName('input')[1]
let number = /[0-9]/
let lowLetter = /[a-z]/
let upLetter = /[A-Z]/
let special = /[+=_,.<>{}~!@#$%^&*-]/g
password.onkeyup = function () {
    let score = 0
    let value = this.value
    // 判断长度
    if (value.length <= 4) score += 5
    else if (value.length <= 7) score += 10
    else score += 25
    // 判断字母
    if (lowLetter.test(value) && upLetter.test(value)) score += 20
    else if (lowLetter.test(value) || upLetter.test(value)) score += 10
    // 判断数字
    if (value.match(/[0-9]/g) !== null && value.match(/[0-9]/g).length >= 3) score += 20
    else if (value.match(/[0-9]/g) !== null && value.match(/[0-9]/g).length >= 1) score += 10
    // 判断符号
    if (value.match(special) !== null && value.match(special).length > 1) score += 25
    else if (value.match(special) !== null && value.match(special).length === 1) score += 10
    // 奖励
    if (number.test(value) && upLetter.test(value) && lowLetter.test(value) && special.test(value)) score += 5
    else if (number.test(value) && (upLetter.test(value) || lowLetter.test(value)) && special.test(value)) score += 3
    else if (number.test(value) && (upLetter.test(value) || lowLetter.test(value))) score += 2

    let span1 = document.getElementsByTagName('span')[1]
    console.log(score)
    if (score >= 70) {
        // Secure
        span1.innerHTML = 'Secure'
        span1.style.color = 'limegreen'
    } else if (score >= 50) {
        // Average
        span1.innerHTML = 'Average'
        span1.style.color = 'yellow'
    } else {
        // Weak
        span1.innerHTML = 'Weak'
        span1.style.color = 'red'
    }
}
```

#### 3.2.2 注册请求

与登录类似，就不贴代码了

#### 3.2.3 后端注册接口

```js
apiRouter.post('/register', (req, res) => {
    const userInfo = req.body
    // 查询数据库
    const sql = 'select * from user where email = ?'
    db.query(sql, userInfo.email, function (err, results) {
        // 执行 sql 失败
        if (err) {
            return res.send({status: 1, message: err.message})
        }
        // 邮箱已被注册
        if (results.length > 0) {
            return res.send({status: 102, message: '邮箱已被注册'})
        }
        // 调用 bcrypt 对密码进行加密
        let hash = bcrypt.hashSync(userInfo.password, 10)
        // 插入新用户
        const sql = 'insert into user set ?'
        db.query(sql, {id: 0, email: userInfo.email, pwd: hash}, (err, results) => {
            if (err) {
                return res.send({status: 1, message: err.message})
            }
            if (results.affectedRows !== 1) {
                return res.send({status: 1, message: '注册用户失败'})
            }
            res.send({status: 0, message: '注册成功'})
        })
    })
})
```

### 3.3 注销

```js
function log_off() {
    localStorage.removeItem("token")
    localStorage.removeItem("email")
    window.location.href = "http://127.0.0.1:8080/login"
}
```

### 3.4 鉴权

鉴权方案采用 JWT

- 使用第三方包 `express-jwt@8.2.1, jsonwebtoken@9.0.0`

- 用户登陆成功后将返回的 token 保存到 localStorage
- 用户访问需要鉴权的页面时，会向后端鉴权接口发送请求(/check)，将 token 保存在请求头中(`Authorization`)，查看是否有权访问

**前端**

```js
$.ajax({
        type: 'GET',
        url: 'http://localhost:8080/check',
        headers: {
            Authorization: localStorage.getItem("token")
        },
        dataType: 'json',
        success: function (data) {
            if (data.status !== 0) {
                window.location.href = 'http://localhost:8080/check'
            } else {
                let button = document.getElementsByClassName('user')[0]
                button.innerText = '当前用户: ' + localStorage.getItem('email')
            }
        }
    })
```

**后端**

- 登录时生成 token

  ```js
  // apiRouter.js
  // 登陆成功, 生成 JWT
  const user = { ...results[0], pwd: ''}
  const token = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: '5h' // token 有效期为5小时
  })
  // 将token响应给客户端
  res.send({
      status: 0,
      message: '登陆成功',
      token: 'Bearer ' + token,
      email: userInfo.email
  })
  ```

- 添加中间件

  ```js
  // config.js
  module.exports = {
      jwtSecretKey: '201250141liuyu'
  }
  // app.js
  const config = require('./config')
  const {expressjwt: jwt} = require("express-jwt");
  app.use('/check', jwt({ secret: config.jwtSecretKey, algorithms: ["HS256"] }))
  ```

- 添加接口

  ```js
  // router.js
  // 鉴权接口
  router.get('/check', (req, res) => {
      res.send({
          status: 0,
          message: '认证通过'
      })
  })
  ```

### 3.5 密码加密

加密分为两部分

- 前端向后端发送信息时对密码加密

  - 使用 `window.btoa()` 对密码进行加密，并加入了固定的盐

    ```js
    const salt = '201250141ly'
    let password = inputs[1].value
    password = window.btoa(window.btoa(password + salt) + salt)
    ```

- 后端保存到数据库时，再次对密码加密

  - 使用第三方包 `bcryptjs@2.4.3` 对密码进行 Bcrypt 加密

    ```js
    // 注册：调用 bcrypt.hashSync() 对密码进行加密
    let hash = bcrypt.hashSync(userInfo.password, 10)
    
    // 登录：调用 bcrypt.compareSync() 比较密码是否一致
    const boolRes = bcrypt.compareSync(userInfo.password, results[0].pwd)
    if (!boolRes) {
        return res.send({status: 101, message: '密码错误'})
    }
    ```

### 3.6 图片验证码

通过随机数 + canvas 实现，每次点击都会重置验证码

```js
let code;
window.onload = function() {
    createCode();
}

function createCode() {
    code = "";
    let codeLength = 4; // 4位验证码
    const random = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for(let i = 0; i < codeLength; i++) { // 随机数生成验证码
        let charIndex = Math.floor(Math.random() * 62);
        code += random.charAt(charIndex);
    }
    // 绘制 canvas
    let canvas = document.createElement("canvas");
    let input = document.getElementsByTagName('input')[2]
    canvas.width = 70;
    canvas.height = 35;
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(46, 52, 64)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(255,255,224)";
    ctx.font = "18px Consolas";
    ctx.fillText(code, 10, 25);
    // 转为 img
    let img = new Image();
    img.src = canvas.toDataURL("image/png");
    img.style.opacity = '0.8';
    img.style.position = 'absolute';
    img.style.left = input.getBoundingClientRect().right + 8 + 'px';
    img.style.top = input.getBoundingClientRect().top + 'px';
    img.id = 'check';
    document.body.appendChild(img);
    $('#check').click(() => {
        let img=document.getElementById('check');
        img.parentElement.removeChild(img);
        createCode();
    })
}

function check(input) {
    // 不区分大小写
    return input.toUpperCase() === code.toUpperCase()
}
```

### 3.7 跨域问题

通过引入第三方包 `cors@2.8.5` 实现

```js
const cors = require('cors')
app.use(cors())
```

