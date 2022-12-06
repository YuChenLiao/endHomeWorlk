function Plane() {
  this.renderArr = [];//渲染数组
  this.renderArr2 = [];//渲染数组2
  this.urlObj = {};//图片路径对象
  this.imgObj = {};//图片对象

  this.myPlane = null;//我的飞机
  this.bullets = [];//子弹数组
  this.enemyPlanes = [];//敌机数组

  this.count = 1000;//1000分结束游戏，每一个10分，打死100个敌机获得胜利
  this.curCount = 0;
  //游戏标记
  this.flag = 'start';
}

//组装图片路径
Plane.prototype.loadUrl = function () {
  //组装普通图片路径
  var nameArr = ['bg', 'bullet', 'myplane1', 'bullet', 'enemy1', 'enemy2', 'enemy3', 'enemy4', 'win', 'lost'];
  var commonObj = {};
  for (var i = 0; i < nameArr.length; i++) {
    commonObj[nameArr[i]] = "images/" + nameArr[i] + ".png";
  }
  //分组方便取
  this.urlObj['common'] = commonObj;

  var boom1Obj = {};
  //组装爆炸图片路径
  for (var j = 1; j <= 9; j++) {
    boom1Obj[j] = "images/myplane1boom/myplane1boom" + j + ".png";
  }
  this.urlObj['myplane'] = boom1Obj;

  for (var index = 1; index <= 4; index++) {
    var boomObj = {};
    //组装爆炸图片路径
    for (var i = 1; i <= 6; i++) {
      boomObj[i] = "images/enemy" + index + "boom/enemy" + index + "boom" + i + ".png";
    }
    //分组方便取
    this.urlObj['boom' + index] = boomObj;
  }

}
//组装音乐对象
Plane.prototype.initMusic = function (musicObj) {
  var keys = Object.keys(musicObj);
  var key;
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    this[key] = musicObj[key];
  }
}

//初始化
Plane.prototype.init = function (el, musicObj) {
  if (!el) return;
  this.el = el;
  this.loadUrl();
  this.initMusic(musicObj);

  var canvas = document.createElement('canvas');//创建画布
  canvas.style.cssText = "background:white;";
  var W = canvas.width = 520; //设置宽度
  var H = canvas.height = 620;//设置高度

  el.appendChild(canvas);//添加到指定的dom对象中
  this.ctx = canvas.getContext('2d');
  this.canvas = canvas;
  this.w = W;
  this.h = H;

  var canvas2 = document.createElement('canvas');//创建画布
  canvas2.style.cssText = "position:absolute;left:0px;";//设置样式
  canvas2.width = W; //设置宽度
  canvas2.height = H;//设置高度
  el.appendChild(canvas2);//添加到指定的dom对象中
  this.ctx2 = canvas2.getContext('2d');
  this.canvas2 = canvas2;

  //加载图片，并回调绘制出图片（因为图片是异步加载的，所以要用回调）
  _.imageLoad(this.urlObj, this.imgObj, this.draw.bind(this));
  //给canvas2画布添加鼠标移动事件（因为画布2在上面）
  canvas2.addEventListener('mousemove', this.mouseMove.bind(this));
  //给canvas2画布添加鼠标右键事件
  canvas2.addEventListener('contextmenu', this.contextMenu.bind(this));
}

//渲染图形
Plane.prototype.render = function () {
  var context = this.ctx;
  this.clearCanvas();
  _.each(this.renderArr, function (item) {
    item && item.render(context);
  });
}
//清洗画布
Plane.prototype.clearCanvas = function () {
  this.ctx.clearRect(0, 0, parseInt(this.w), parseInt(this.h));
}

//创建我机
Plane.prototype.createMyPlane = function () {
  var image, myPlane, sx = 0, sy = 0, sWidth = 132, sHeight = 86, dx = 200, dy = 530, dWidth = 132, dHeight = 86;
  image = this.imgObj['common']['myplane1'];
  myPlane = new _.ImageDraw({ image: image, sx: sx, sy: sy, sWidth: sWidth, sHeight: sHeight, dx: dx, dy: dy, dWidth: dWidth, dHeight: dHeight });
  this.renderArr2.push(myPlane);
  this.myPlane = myPlane;

  //清除自己
  var obj = this;
  myPlane.destory = function () {
    clearInterval(this.timmer);
    clearInterval(this.boomTimmer);
    obj.myPlane = null;
    //游戏结束
    obj.flag = 'end';
  }
  //爆炸函数
  myPlane.boomIndex = 1;
  myPlane.boom = function () {
    obj.boomMusic.play();
    //切换图片，切换完成，清除定时器
    myPlane.boomTimmer = setInterval(doboom, 100);
  }

  function doboom() {
    if (myPlane.boomIndex > 9) {//爆炸完成
      //清除当前飞机
      myPlane.destory();
    }
    myPlane.image = obj.imgObj['myplane'][myPlane.boomIndex++];
  }
}

//右键事件
Plane.prototype.contextMenu = function (e) {
  var e = e || window.event;
  //取消右键默认事件
  e.preventDefault && e.preventDefault();
}

//鼠标移动事件
Plane.prototype.mouseMove = function (e) {
  var w = 132, h = 86
  var pos = _.getOffset(e);//获取鼠标位置
  var plane = this.myPlane;
  if (!plane) return;
  //鼠标在飞机范围内，才会跟随
  if (plane.isPoint(pos)) {
    if (isOut.call(this, pos, w, h)) {
      return;
    }
    plane.dx = pos.x - w / 2;
    plane.dy = pos.y - h / 2;
  }
  //判断超出边界
  function isOut(pos, w, h) {
    if (pos.x + w / 2 >= this.w) {//超出右边
      return true;
    }
    if (pos.x - w / 2 <= 0) {//超出左边
      return true;
    }
    if (pos.y + h / 2 >= this.h) {//超出下边
      return true;
    }
    if (pos.y - h / 2 <= 0) {//超出上边
      return true;
    }

    return false;
  }

}

//绘制入口
Plane.prototype.draw = function () {
  this.drawBG();
  this.render();//渲染到页面上
  this.createMyPlane();
  this.render2();
}

//绘制背景
Plane.prototype.drawBG = function () {
  var image, img, sx = 0, sy = 0, sWidth = 520, sHeight = 620, dx = 0, dy = 0, dWidth = 520, dHeight = 620;
  //背景
  image = this.imgObj['common']['bg'];
  img = new _.ImageDraw({ image: image, sx: sx, sy: sy, sWidth: sWidth, sHeight: sHeight, dx: dx, dy: dy, dWidth: dWidth, dHeight: dHeight });
  this.renderArr.push(img);
}

global.plane = plane;