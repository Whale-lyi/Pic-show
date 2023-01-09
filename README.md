# Pic-show

NJUSE Web-Frontend Project

### 项目启动

数据库脚本见 web_2022.sql, 先创建数据库，修改 `db.js` 中的数据库信息

进入项目后，在终端输入

```bash
npm install
node ./app.js
```

启动项目后，浏览器打开 http://127.0.0.1:8080/, 进入登录页

### 登录

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

### 注册

![image-20230102221101641](https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230102221101641.png)

- 邮箱、密码、验证密码如果输入正确，会跳转到登陆页面

- 用户输入密码会提示密码强度，如下表所示([评分细则](https://zhuanlan.zhihu.com/p/25545606))

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

### 鉴权

用户未登录时，只允许访问

- 登录页
  - http://127.0.0.1:8080/  (会重定向到/login)
  - http://127.0.0.1:8080/login
- 注册页
  - http://127.0.0.1:8080/register

访问一级页面或二级页面，会因为鉴权失败而无法访问 (打开这些网页时会**自动向后端发送权限检查的请求**(/check)) 

<img src="https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230102185320025.png" alt="image-20230102185320025"  />

### 一级页面

- 可以点击右下方按钮进行主题切换
- 点击右上方 Log off 按钮会注销并回到登录页

![image-20230104004004499](https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230104004004499.png)

### 二级页面

- 显示原图，生成的黑白线稿，带有可见水印，频域水印的图片
  - 黑白线稿采用 canny 算法对图像的边缘进行检测，使用的库为 [jsfeat](https://github.com/inspirit/jsfeat)


![image-20230109174525477](https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230109174525477.png)

![image-20230109210618808](https://whale-picture.oss-cn-hangzhou.aliyuncs.com/img/image-20230109210618808.png)
