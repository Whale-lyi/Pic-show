let code;
window.onload = function() {
    createCode();
}

function createCode() {
    code = "";
    let codeLength = 4;
    const random = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    for(let i = 0; i < codeLength; i++) { //循环操作
        let charIndex = Math.floor(Math.random() * 62);
        code += random.charAt(charIndex);
    }
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
    return input.toUpperCase() === code.toUpperCase()
}