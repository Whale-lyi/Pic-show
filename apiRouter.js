const express = require('express')
const bcrypt = require("bcryptjs")
const db = require('./db')
const jwt = require('jsonwebtoken')
const config = require('./config')
// 创建路由对象
const apiRouter = express.Router()

// 注册新用户
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

// 将路由对象共享出去
module.exports = apiRouter
