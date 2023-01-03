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

app.listen(8080, () => {
    console.log('api server running at http://127.0.0.1:8080')
})
