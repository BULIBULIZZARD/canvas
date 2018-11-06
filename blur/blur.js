var canvasWidth = window.innerWidth;
var canvasHeight = window.innerHeight;

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
canvas.width = canvasWidth;
canvas.height = canvasHeight;

var radius = 50;
var leftMargin = 0, topMargin = 0;

var image = new Image();
var clippingRegion = {
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    r: radius,
};

image.src = "image.jpg";
image.onload = function () {
    $("#blur-div").css("width", canvasWidth + "px");
    $("#blur-div").css("height", canvasHeight + "px");

    $("#blur-image").css("width", image.width + "px");
    $("#blur-image").css("height", image.height + "px");

    leftMargin = (image.width - canvasWidth) / 2;
    topMargin = (image.height - canvasHeight) / 2;

    $("#blur-image").css("left", String(-leftMargin) + +"px");
    $("#blur-image").css("top", String(-topMargin) + "px");
    initCanvas()
};

function initCanvas() {
    var theleft = leftMargin < 0 ? -leftMargin : 0;
    var thetop = topMargin < 0 ? -topMargin : 0;
    clippingRegion = {
        x: Math.random() * (canvasWidth - 2 * radius - 2 * theleft) + radius + theleft,
        y: Math.random() * (canvasHeight - 2 * radius - 2 * thetop) + radius + thetop,
        r: 100,
    };
    draw(image, clippingRegion);
}

function draw(image, clippingRegion) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.save();
    setClippingRegion(clippingRegion);
    context.drawImage(image, Math.max(leftMargin,0), Math.max(topMargin,0),
        Math.min(canvasWidth,image.width), Math.min(canvasHeight,image.height),
        leftMargin < 0 ? -leftMargin : 0, topMargin < 0 ? -topMargin : 0,
        Math.min(canvasWidth,image.width), Math.min(canvasHeight,image.height));
    context.restore();
}

function setClippingRegion(clippingRegion) {
    context.beginPath();
    context.arc(clippingRegion.x, clippingRegion.y, clippingRegion.r, 0, Math.PI * 2);
    context.clip()
}

function reset() {
    initCanvas();
}

function show() {
    var theAnimation = setInterval(function () {
        console.log("show");
        clippingRegion.r += 20;
        if (clippingRegion.r > 2 * Math.max(image.height, image.width)) {
            clearInterval(theAnimation);
        }
        draw(image, clippingRegion);
    }, 30)
}

canvas.addEventListener("touchstart",function (e) {
   e.preventDefault();
});