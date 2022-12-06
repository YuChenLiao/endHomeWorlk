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

