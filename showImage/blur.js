var canvasWidth = 2000;
var canvasHeight = 1143;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var isMouseDown = false;
var imageReady = false;
var lastPoint = {x: 0, y: 0};
canvas.width = canvasWidth;
canvas.height = canvasHeight;


var pattern ;
var image = new Image();
image.src = "image.jpg";
image.onload = function () {
    imageReady = true;
    pattern = context.createPattern(image,"no-repeat");
};

function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: Math.round(x - bbox.left),
        y: Math.round(y - bbox.top),
    };
}

canvas.onmousedown = function (e) {
    e.preventDefault();
    isMouseDown = true;
    lastPoint = windowToCanvas(e.clientX, e.clientY);
};
canvas.onmouseup = function (e) {
    e.preventDefault();
    isMouseDown = false;

};
canvas.onmouseout = function (e) {
    e.preventDefault();
    isMouseDown = false;

};
canvas.onmousemove = function (e) {
    e.preventDefault();
    if (isMouseDown) {
        var curPoint = windowToCanvas(e.clientX, e.clientY);

        imageLine(curPoint,lastPoint);

        lastPoint = curPoint;
    }

};

function imageLine(curPoint,lastPoint) {
    context.beginPath();
    context.moveTo(curPoint.x,curPoint.y);
    context.lineTo(lastPoint.x,lastPoint.y);
    context.strokeStyle=pattern;
    context.lineWidth=20;
    context.lineCap="round";
    context.stroke();

}
