//import "fabric";

// TODO: on group selection remove rotation
// https://embed.plnkr.co/plunk/ATNrv5

const primaryColor = "rgba(81,146,242,0.8)";
const primaryColorLight = "rgba(81,146,242,0.1)";

var canvas = new fabric.Canvas("mycanvas", {
  stopContextMenu: true,
  fireRightClick: true,
  includeDefaultValues: false,
  hoverCursor: "pointer",
  selectionBorderColor: primaryColor, //"#009efe",
  selectionColor: primaryColorLight //"rgb(226, 243, 255, 0.3)"
});
fabric.Object.prototype.cornerStyle = "circle";
fabric.Object.prototype.cornerSize = 7;
fabric.Object.prototype.borderScaleFactor = 1;
fabric.Object.prototype.cornerColor = primaryColor; //'rgb(255, 255, 255)';
fabric.Object.prototype.cornerStrokeColor = primaryColor; //'rgb(53, 167, 242,0.9)';
fabric.Object.prototype.borderColor = primaryColor; //'rgb(53, 167, 242,0.9)';
fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.strokeUniform = true;
fabric.Object.prototype.opacity = 0.8;
fabric.Object.prototype.padding = 4;
fabric.Object.prototype.lockScalingFlip = true;

const objectControls = {
  mtr: false,
  tl: false,
  bl: false,
  tr: false,
  br: false
};
const objectControlsImg = {
  mtr: false,
  tl: false,
  bl: false,
  tr: false,
  br: false,
  ml: false,
  mb: false,
  mr: false,
  mt: false
};

var textboxes = [];

function createTextbox(text, fontSize) {
  return new fabric.Textbox(text, {
    left: 100,
    top: 50,
    width: 90,
    fontFamily: "Helvetica",
    fontSize: fontSize,
    backgroundColor: "yellow",
    minWidth: 60,
    minHeight: 30,
    textAlign: "center",

    lastHeight: 0
    //selectionBackgroundColor: "pink"
  });
}

textboxes.push(createTextbox("a b c d e f g h i j", 14));
textboxes.push(createTextbox("First Name", 14));
//textboxes.push(createTextbox("Sign Here", 14));

const updateTextSize = (options) => {
  console.log(options);
  let textbox = options.target;

  const controlPoint = textbox.__corner;

  //mr and ml are the only controlPoints that dont modify textbox height
  if (controlPoint && controlPoint !== "mr" && controlPoint !== "ml") {
    textbox.lastHeight = textbox.height * textbox.scaleY;
    if ((textbox.lastHeight || textbox.height) < textbox.minHeight)
      textbox.lastHeight = textbox.minHeight;
  }

  textbox.set({
    height: textbox.lastHeight || textbox.height,
    scaleY: 1,
    scaleX: 1
  });

  canvas.renderAll();
};

function render() {
  textboxes.forEach((t) => {
    t.clipTo = function (ctx) {
      let h = t.height;
      ctx.rect(-t.width / 2, -h / 2, t.width, h);
    };
    t.on("scaling", updateTextSize);
    t.on("editing:entered", updateTextSize);
    canvas.on("text:changed", updateTextSize);

    // http://fabricjs.com/controls-customization
    // hide rotation control point
    t.setControlsVisibility(objectControls);

    canvas.add(t);
  });
}

var imgElement = document.getElementById("signature");
var imgInstance = new fabric.Image(imgElement, {
  left: 100,
  top: 300,
  scaleX: 0.33,
  scaleY: 0.33,
  //borderColor: "red",
  stroke: "#07C", //<-- set this
  strokeWidth: 0 //<-- set this
  //selectable: false
  //angle: 30,
  //opacity: 0.85
});
imgInstance.setControlsVisibility(objectControlsImg);
//canvas.add(imgInstance);

var btn = document.getElementById("btnSign");
btn.onclick = function () {
  canvas.clear();
  textboxes.push(createTextbox("Sign Here", 14));
  render();
};

var btnInitial = document.getElementById("btnInitial");
btnInitial.onclick = function () {
  //canvas.hoverCursor = 'copy'
  if (canvas.defaultCursor === "crosshair") {
    canvas.defaultCursor = "default";
  } else {
    canvas.defaultCursor = "crosshair";
  }
};
