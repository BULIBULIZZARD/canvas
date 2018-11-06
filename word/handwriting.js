var canvasWidth = Math.min(800,$(window).width()-20);
var canvasHeight = canvasWidth;

var storkeColor = "black";

var isMouseDown = false;
var lastLoc = {x: 0, y: 0};
var lastTimestamp = 0;
var lastLineWidth = -1;

var canvas = document.getElementById("canvas");

var context = canvas.getContext("2d");

canvas.width = canvasWidth;
canvas.height = canvasHeight;

$("#controller").css("width",canvasWidth+"px");
drawGrid();


$("#clear_btn").click(
    function (e) {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        drawGrid();
    }
);
$(".color_btn").click(
    function (e) {
        $(".color_btn").removeClass("color_btn_selected");
        $(this).addClass("color_btn_selected");
        storkeColor=$(this).css("background-color");
    }
);

function beginStroke(point){
    isMouseDown = true;
    lastLoc = windowToCanvas(point.x, point.y);
    lastTimestamp = new Date().getTime();
}

function endStroke(){
    isMouseDown = false;
}

function moveStroke(point){
    var curLoc = windowToCanvas(point.x, point.y);
    var calTimestamp = new Date().getTime();
    var s = calcDistance(curLoc, lastLoc);
    var t = calTimestamp - lastTimestamp;
    var lineWidth = calcLineWidth(t, s);

    //draw(curLoc, lineWidth);
    context.beginPath();
    context.moveTo(lastLoc.x, lastLoc.y);
    context.lineTo(curLoc.x, curLoc.y);

    context.strokeStyle = storkeColor;
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();

    lastLoc = curLoc;
    lastTimestamp = calTimestamp;
    lastLineWidth = lineWidth;
}
canvas.onmousedown = function (e) {
    e.preventDefault();
    beginStroke({x:e.clientX,y:e.clientY});
};
canvas.onmouseup = function (e) {
    e.preventDefault();
    endStroke();
};
canvas.onmouseout = function (e) {
    e.preventDefault();
    endStroke();
};
canvas.onmousemove = function (e) {
    e.preventDefault();
    if (isMouseDown) {
        moveStroke({x:e.clientX,y:e.clientY});
    }
};

canvas.addEventListener('touchstart',function (e) {
    e.preventDefault();
    touch = e.touches[0];
    beginStroke({x:touch.pageX,y:touch.pageY});
});
canvas.addEventListener('touchmove',function (e) {
    e.preventDefault();
    if (isMouseDown) {
        touch = e.touches[0];
        moveStroke({x:touch.pageX,y:touch.pageY});
    }
});
canvas.addEventListener('touchend',function (e) {
    e.preventDefault();
    endStroke();
});


var maxLineWidth = 25;
var minLineWidth = 1;
var maxStrokeV = 10;
var minStrokeV = 0.1;

function calcLineWidth(t, s) {
    var v = s / t;
    var resultLineWidth;
    if (v < minStrokeV) {
        resultLineWidth = maxLineWidth;
    } else if (v >= maxStrokeV) {
        resultLineWidth = minLineWidth;
    } else {
        resultLineWidth = maxLineWidth - (v - minStrokeV) / (maxStrokeV - minStrokeV) * (maxLineWidth - minLineWidth);
    }
    if (lastLineWidth == -1) {
        return resultLineWidth;
    }
    return lastLineWidth * 2 / 3 + resultLineWidth / 3;
}

function draw(curLoc, lineWidth) {
    context.beginPath();
    context.moveTo(lastLoc.x, lastLoc.y);
    context.lineTo(curLoc.x, curLoc.y);
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
}

function calcDistance(loc1, loc2) {

    return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y));
}

function windowToCanvas(x, y) {
    var bbox = canvas.getBoundingClientRect();
    return {
        x: Math.round(x - bbox.left),
        y: Math.round(y - bbox.top),
    };
}

function drawGrid() {
    context.save();
    context.strokeStyle = "rgb(230,11,9)";
    context.beginPath();
    context.moveTo(3, 3);

    context.lineTo(canvasWidth - 3, 3);
    context.lineTo(canvasWidth - 3, canvasHeight - 3);
    context.lineTo(3, canvasHeight - 3);
    context.closePath();

    context.lineWidth = 6;
    context.stroke();

    context.lineWidth = 1;
    noLine(0, 0, canvasWidth, canvasHeight);
    noLine(canvasWidth, 0, 0, canvasHeight);
    noLine(canvasWidth / 2, 0, canvasWidth / 2, canvasHeight);
    noLine(0, canvasHeight / 2, canvasWidth, canvasHeight / 2);

    context.stroke();
    context.restore();
}

function noLine(x, y, lx, ly) {
    context.beginPath();
    var num = 80;
    var scaleX = (lx - x) / num;
    var scaleY = (ly - y) / num;
    for (var i = 0; i < num; i += 2) {
        context.moveTo(x + scaleX * i, y + scaleY * i);
        context.lineTo(x + scaleX * (i + 1), y + scaleY * (i + 1));
    }
    context.closePath();
    context.stroke();
}
