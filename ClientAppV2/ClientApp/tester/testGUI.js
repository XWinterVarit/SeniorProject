var libui = require('libui-node');

var win = new libui.UiWindow('UiForm example', 640, 480, true);

var widget = new libui.UiForm();
win.setChild(widget);

win.onClosing(function () {
    win.close();
    libui.stopLoop();
});

win.show();

libui.startLoop();