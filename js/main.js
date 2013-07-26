var CanvasPaint = CanvasPaint || {};

function resizeCanvas(canvas){
    $(".section-content").height($(document).innerHeight()-80);
    $(canvas)
        .attr("width", $(".section-content").innerWidth()+300)
        .attr("height", $(".section-content").innerHeight()+300);
}
function grabMouseData(event){
    return {
        LMB : (event.which === 1),
        X : event.pageX,
        Y : event.pageY
    };
}
function updateMouseCoords(mouseData){
    $("#mouseCoordsX").text("X:{0}".format(mouseData.X)+300);
    $("#mouseCoordsY").text("Y:{0}".format(mouseData.Y)+300);
}

$(document).ready(function(){
    ApplicationMenu.getInstance().initializeMenu();
    $('#colorpicker').farbtastic('#color');
    var canvas = $("#drawingSurface");
    //size canvas
    resizeCanvas(canvas);
    //get 2d drawing context
    var drawingContext = canvas[0].getContext("2d");
    //attach mouse handlers
    canvas.mousedown(function(){
        var self = this;
        var mouseData = grabMouseData(event);
        //check if LMB is pressed
        if(mouseData.LMB){
            //set drawing on
            drawingContext.beginPath();
            //move to mousedown position
            drawingContext.moveTo(
                (mouseData.X-canvas.offset().left),
                (mouseData.Y-canvas.offset().top));
            $(self).mousemove(function(event){
                //get current mouse position
                var currentMouseData = grabMouseData(event);
                //display current mouse position
                updateMouseCoords(currentMouseData);
                //draw a line between the points
                drawingContext.lineTo(
                    (currentMouseData.X-canvas.offset().left),
                    (currentMouseData.Y-canvas.offset().top));
                drawingContext.strokeStyle = getForecolor();
                drawingContext.stroke();
            }).mouseup(function(){
                var self = this;
                $(self).unbind("mousemove");
                $(self).unbind("mouseup");
            });
        }
    });
    $("#newCanvas").click(function(){
        $.noop();
    });
    $("#saveCanvas").click(function(){
        var encodedCanvas = canvas[0].toDataURL("image/png").replace("image/png", "image/octet-stream");
        window.location.href = encodedCanvas;
    });
    $("#clearCanvas").click(function(){
        var canvasW = $("#drawingSurface").width(),
            canvasH = $("#drawingSurface").height();
        $("#drawingSurface")[0].getContext("2d").clearRect(0,0,canvasW,canvasH);
    });
});
function getForecolor(){
    return $(".colorpicker #color").val();
}
//added formatting function to String object prototype
String.prototype.format = function(){
    var formattedString = this;
    for(var phIndex = 0; phIndex < arguments.length; phIndex++){
        var phTemplate = "{" + phIndex + "}";
        formattedString = formattedString.replace(phTemplate,arguments[phIndex]);
    }
    return formattedString;
}