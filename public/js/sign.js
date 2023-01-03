let emailCheck = true
function register() {
    const salt = '201250141ly'
    let inputs = document.getElementsByTagName('input')
    let email = inputs[0].value
    let password = inputs[1].value
    let confirm = inputs[2].value
    if (!email || !password) {
        alert('邮箱或密码不能为空')
    } else if (!emailCheck) {
        // 邮箱格式不合法
    } else {
        let span0 = document.getElementsByTagName('span')[0]
        let span2 = document.getElementsByTagName('span')[2]
        // 对密码进行加密
        let newPass = window.btoa(window.btoa(password + salt) + salt);
        if (password === confirm) {
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8080/api/register',
                data: {
                    email: email,
                    password: newPass
                },
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'json',
                success: function (data) {
                    if (data.status === 0) {
                        window.location.href = 'http://localhost:8080/login'
                    } else if (data.status === 102) {
                        // 邮箱已注册
                        span0.innerHTML = '邮箱已注册'
                        span2.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                    } else {
                        alert(data)
                    }
                },
                error: function (data) {
                    console.log('出错了')
                }
            })
        } else {
            // 两次密码不一致
            span0.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            span2.innerHTML = '密码不一致'
        }
    }
}

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
                        span1.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                        span3.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                    } else if (data.status === 101) {
                        // 密码错误
                        span1.innerHTML = '密码错误&nbsp;&nbsp;'
                        span0.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
                        span3.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
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
            span0.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            span1.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'
            span3.innerHTML = '验证码错误'
        }
    }
}
