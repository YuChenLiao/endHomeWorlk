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