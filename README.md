# JSprite
JSprite is a JavaScript library that gives display functionalities in JavaScript, and allows you to work with Sprite objects that have methods to manipulate them. 

# Setup
JSprite will automatically add defined sprites to the selected canvas. To select a canvas, use `JSprite.frame = canvas`, where `canvas` is the id of the canvas you want to add sprites to.

# Creating a Sprite
To create a sprite, use the following:
```Javascript
var Sprite = JSprite(function (name){
  this.name = name;
  console.log(name);
});
```
This will create a Sprite constructor. To then create a sprite, use `var sprite1 = new Sprite('platypus');`. This will create a sprite, and set its name attribute to `"platypus"`, and `log` it to the console. 

# Manipulating a Sprite
A sprite can be manipulated with any of its built-in methods. In the sprite constructor, or any of the sprite's event callbacks, it can be referred to using the `this` keyword, e.g. `this.goto(100,100)`. In the global context or from another sprite, you can refer to it by a variable it is stored in, e.g. `sprite1.goto(100,100)`. 

# Sprite methods
* `sprite.goto(x,y)` -- set the sprite's coordinates to `(x,y)`, with `(0,0)` at the center of the canvas.
* `sprite.move(steps)` -- move the sprite forward `steps` pixels, in the direction of its angle
* `sprite.point(a[,b])` -- if `a` is an object, point towards the object's X and Y coordinates. If `a` is a number and `b` is a number, point towards `(a,b)`. If `a` is a number and `b` is not specified, point in direction `a`.

# Sprite properties
* `sprite.x` -- the sprite's x-coordinate
* `sprite.y` -- the sprite's y-coordinate
* `sprite.image` -- the image the sprite uses.
* `sprite.image = string` -- if the string starts with `#`, sets the image to an `<img>` element on the page with id of `string`. Otherwise, it finds an image at the URL of `string`.
* `sprite.angle` -- the direction the sprite is facing.
* `sprite.angle = number` -- points the sprite in the specified direction, modulo 360 (negative numbers turn backwards).

# Events
JSprite supports a few events, mostly related to the mouse
* `sprite.onmousedown` -- function that is fired when the mouse is clicked anywhere
* `sprite.onmouseup` -- function that is called when mouse is released 
* `sprite.onmousemove` -- function that is called when the mouse is moved
* `sprite.update` -- function that is called every `JSprite.timer.int` ms when program is in `running` state

# Timer
The `timer` object can be accessed by using `JSprite.timer`. It has the following properties:
* `JSprite.timer.int` -- the interval every sprite's `update` function is called. It is given one argument, `t`, the time (in ms) since the last call.
* `JSprite.timer.scale` -- the multiplier given to the `t` argument in `update` functions. Defaults to `0.01` (converts ms to seconds).
The program can start regularly calling the `update` method by using `JSprite.start()`, and it can be ended with `JSprite.stop()`. This can be called at the start of the file, or can be bound to a button.
