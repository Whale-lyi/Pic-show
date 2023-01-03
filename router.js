const express = require('express')
// 创建路由对象
const router = express.Router()

// 登录页
router.get('/', (req, res) => {
    res.redirect('/login')
})
router.get('/login', (req, res) => {
    res.sendFile(__dirname + '/html/login.html')
})
// 注册页
router.get('/register', (req, res) => {
    res.sendFile(__dirname + '/html/register.html')
})
// 主页
router.get('/main', (req, res) => {
    res.sendFile(__dirname + '/html/index.html')
})
// 二级页面
router.get('/secondary/:pic', (req, res) => {
    let fileName = req.params.pic
    res.sendFile(__dirname + '/html/secondary/' + fileName)
})
// 鉴权接口
router.get('/check', (req, res) => {
    res.send({
        status: 0,
        message: '认证通过'
    })
})

// 将路由对象共享出去
module.exports = router
