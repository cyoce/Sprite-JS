var JSprite = function jsp (a,b,c) {
  var init = function (x,y){
    this.goto(x,y);
  };
  var update;
  var img = '';
  if (typeof a === 'object'){
    if ('init'   in a) init   = a.init;
    if ('update' in a) update = a.update;
    if ('image'  in a) img    = a.image;
  } else {
    init   = a || init;
    update = b || update;
    img    = c || img;
  }
  function Img (v) {
    if (v[0] === '#'){
      return new fabric.Image(id(v.substring(1,v.length)))
    }
    return new fabric.Image.fromURL(v);
  }
  var math = jsp.math;
  function proto (obj,name,val) {
    obj.prototype[name] = val;
  }
  function prop () {
    Object.defineProperty.apply(this, arguments);
  }
  var id  = ref => document.getElementById(ref);
  var out = function self () { //constructor function for sprite object
    this.id = jsp.sprites.length;
    jsp.sprites[this.id] = this;
    this.update = update;
    this.image = img || '#tinyplatypus';
    self.img = this.img = img;
    this.x = this.y = 0;
    this.angle = 90;
    this.update = update;
    self.init.apply(this, arguments);
    self.clones.push(this);
    jsp.frame.add(this.raw);
  };
  proto(out,'rawx',0);
  proto(out,'rawy',0);
  proto(out,'rawangle',90);
  proto(out,'updatepos',function () {
    this.goto(this.x,this.y);
    this.angle = this.angle;
  });
  prop(out.prototype,'update',{
    get:function () {
      return this.rawupdate;
    },
    set:function (val) {
      this.rawupdate = val;
      jsp.updates[this.id] = val;
    }
  })
  prop(out.prototype,'image',{
    get:function () {
      return this.img;
    },
    set:function (val) {
      this.img = val;
      if (typeof this.raw !== 'undefined'){
        jsp.canvas.remove(this.raw);
        jsp.canvas.remove(this.raw);
        this.raw.parent = this;
      }
      this.raw = Img(val);
      this.raw.set({
        originX: 'center',
        originY: 'center',
        left:    this.raw.getLeft(),
        top:     this.raw.getTop(),
        angle:   this.raw.getAngle(),
        selectable: false
      });
      this.add();
      this.updatepos();
      jsp.render;
    }
  });
  prop(out.prototype,'x',{
    get:function () {
      return this.rawx;
    },
    set:function (val) {
      this.rawx = val;
      if(typeof this.raw !== 'undefined'){
        this.raw.set('left',jsp.frame.width/2 + val);
      }
      jsp.render;
    }
  });
  prop(out.prototype,'y',{
    get:function () {
      return this.rawy;
    },
    set:function (val) {
      this.rawy = Math.round(val * 1e10) / 1e10;
      if(typeof this.raw !== 'undefined'){
        this.raw.set('top',jsp.frame.height/2 - this.rawy);
      }
      jsp.render;
    }
  });
  prop(out.prototype,'angle',{
    get:function () {
      return this.rawangle;
    },
    set: function (val) {
      this.rawangle = math.mod(val,360);
      this.raw.set('angle',val - 90);
      jsp.render;
    }
  });
  out.init   = init;
  out.img    = img;
  out.clones = [];
  proto(out,'goto',function (a,b) {
    var x,y;
    if(typeof a.x !== 'undefined'){
      x = a.x, y = a.y;
    } else {
      x = a, y = b;
    }
    this.x = x;
    this.y = y;
    return this;
  });
  proto(out,'point',function (a,b){
    var newx,newy,x,y;
    if (typeof a === 'object'){
      newx = a.x;
      newy = a.y;
    } else if (typeof b === 'number'){
      newx = a;
      newy = b;
    } else {
      this.angle = a;
      return this;
    }
    x = this.x - newx;
    y = this.y - newy;
    if (x === 0 && y === 0);
    else if (x === 0){
      if (y > 0){
        this.angle = 0;
      } else {
        this.angle = 180;
      }
    } else if (y === 0){
      if (x > 0){
        this.angle = 90;
      } else {
        this.angle = 270;
      }
    } else {
      this.angle = math.atan2(x,y) + 180;
    }
    return this;
  });
  proto(out,'move',function (steps) {
    if (typeof steps === 'undefined') steps = 1;
    this.x += jsp.math.sin(this.angle) * steps;
    this.y += jsp.math.cos(this.angle) * steps;
    return this;
  });
  proto(out,'add',function () {
    jsp.frame.add(this.raw);
  });
  return out;
}
Object.defineProperty(JSprite,'frame',{
  get: _ => JSprite.canvas,
  set: updateCanvas
});
Object.defineProperty(JSprite,'render',{
  get:function () {
    JSprite.canvas.renderAll();
  }
});
JSprite.sprites = [];
JSprite.updates = [];
JSprite.timer = {
  t: new Date,
  oldt: new Date,
  rawinterval: 0,
  id: undefined,
  scale: 0.01,
  defaultint: 100
};
JSprite.start = function () {
  JSprite.timer.int = JSprite.timer.defaultint;
}
JSprite.stop = function () {
  JSprite.timer.int = 0;
}
Object.defineProperty(JSprite.timer,'int',{
  set:function (val) {
    if (val === 0) return clearInterval(JSprite.timer.id);
    JSprite.timer.rawinterval = val;
    if (JSprite.timer.id !== undefined) clearInterval(this.timer.id);
    JSprite.timer.oldt = JSprite.timer.t = new Date;
    JSprite.timer.id = setInterval(function (){
      JSprite.timer.oldt = JSprite.timer.t;
      JSprite.timer.t = new Date;
      for(var i = 0; i < JSprite.sprites.length;i++){
        var update = JSprite.updates[i];
        var sprite = JSprite.sprites[i];
        if (update !== undefined){
          var t = (new Date - JSprite.timer.oldt) * JSprite.timer.scale;
          update.call(sprite,t);
        }
      }
    }, val);
  }
})
JSprite.pending = false;
JSprite.requestRender = function () {
  if(JSprite.pending) clearTimeout(JSprite.pending);
  JSprite.pending = setTimeout(function () {
    JSprite.pending = false;
    JSprite.canvas.renderAll();
    console.log('render');
  },1);
};
JSprite.realcoords = function (obj){
  return {
    x: obj.x - JSprite.canvas.width  / 2,
    y: JSprite.canvas.height / 2 - obj.y
  };
}

JSprite.math = {
  deg:  radians => radians * 180 / Math.PI,
  rad:  degrees => degrees * Math.PI / 180,
  sin:  angle   => Math.sin(JSprite.math.rad(angle)),
  cos:  angle   => Math.cos(JSprite.math.rad(angle)),
  tan:  angle   => Math.tan(JSprite.math.rad(angle)),
  asin: slope   => JSprite.math.deg(Math.asin(slope)),
  acos: slope   => JSprite.math.deg(Math.acos(slope)),
  atan: slope   => JSprite.math.deg(Math.atan(slope)),
  atan2:(x,y)   => JSprite.math.deg(Math.atan2(x,y)),
  mod:  (x,y)   => (x + y) % y
};
JSprite.mouse = {
  x: 0,
  y: 0,
  down: false,
  last: {
    x: 0,
    y: 0
  }
};
JSprite.mouse.update = function (e){
  var coords = JSprite.realcoords(e);
  JSprite.mouse.last.x = JSprite.mouse.x;
  JSprite.mouse.last.y = JSprite.mouse.y;
  JSprite.mouse.x = coords.x - 7;
  JSprite.mouse.y = coords.y + 26;
};
function updateCanvas(v){
  JSprite.canvas = new fabric.Canvas(v);
  JSprite.canvas.selection = false;
  JSprite.canvas.on('mouse:down',function (options) {
    JSprite.mouse.down = true;
    JSprite.mouse.update(options.e);
  });
  JSprite.canvas.on('mouse:up',function (options){
    JSprite.mouse.down = false;
    JSprite.mouse.update(options.e);
  });
  JSprite.canvas.on('mouse:move',function (options) {
    JSprite.mouse.update(options.e);
  });
}
