function loadIMGtoCanvas(canvasid, callback, maxsize) {
    maxsize = (maxsize === undefined) ? 0 : maxsize;
    var image = new Image();
    image.onload = function() {
        var w=image.width;
        var h=image.height;
        if(maxsize>0){
            if(w>maxsize){
                h=h*(maxsize/w);
                w=maxsize;
            }
            if(h>maxsize){
                w=w*(maxsize/h);
                h=maxsize;
            }
            w=Math.floor(w);
            h=Math.floor(h);
        }
        var canvas = document.createElement('canvas');
        canvas.id = canvasid;
        canvas.width = w;
        canvas.height = h;
        canvas.style.display = "none";
        var body = document.getElementsByTagName("body")[0];
        body.appendChild(canvas);
        var context = canvas.getContext('2d');
        context.drawImage(image, 0, 0,image.width,image.height,0,0,w,h);
        callback();
        document.body.removeChild(canvas);
    };
    var img = document.getElementsByTagName("img")[0];
    image.src = img.src;
}

function writeIMG() {
    let msg = "watermark";
    function writeFunc(){
        if(writeMsgToCanvas('canvas', msg , 'pass', 1) != null){
            const myCanvas = document.getElementById("canvas");
            let img = new Image();
            img.src = myCanvas.toDataURL("image/jpeg", 1.0);
            let div = document.getElementById("blind");
            div.appendChild(img);
        }
    }
    loadIMGtoCanvas('canvas',writeFunc,700);
}
