(function(window) {

function Target() {

  this.initialize();

}
//p est un raccourci
var p = Target.prototype = new createjs.Container();

// public properties:


	p.TargetBody;

	



	p.bounds;

	p.hit;

	

// constructor:

	p.Container_initialize = p.initialize;	

	

	p.initialize = function() {

		this.Container_initialize();

		this.TargetBody = new createjs.Shape();

		this.addChild(this.TargetBody);

		this.makeShape();
		
		this.vX = 4;

		this.vY = 4;

	}

	

// public methods:

	p.makeShape = function() {

		//draw Target body

		var g = this.TargetBody.graphics;

		g.clear();

		g.setStrokeStyle(1);
		g.beginStroke(createjs.Graphics.getRGB(0,255,0));
		g.beginFill(createjs.Graphics.getRGB(255,0,255));
		g.drawCircle(0,0,5);

		this.bounds = 5; 

		this.hit = this.bounds;

	}
	// placer aleatoirement la cible
	p.randomize = function(){
		this.x = Math.random()* canvas.width;
		this.y = Math.random()* canvas.height;
	}

	
	p.tick = function() {

		
		

	}

	

	



window.Target = Target;

}(window));(function(window) {

function Target() {

  this.initialize();

}
//p est un raccourci
var p = Target.prototype = new createjs.Container();

// public properties:


	p.TargetBody;

	



	p.bounds;

	p.hit;

	

// constructor:

	p.Container_initialize = p.initialize;	

	

	p.initialize = function() {

		this.Container_initialize();

		this.TargetBody = new createjs.Shape();

		this.addChild(this.TargetBody);

		this.makeShape();
		
		this.vX = 4;

		this.vY = 4;

	}

	

// public methods:

	p.makeShape = function() {

		//draw Target body

		var g = this.TargetBody.graphics;

		g.clear();

		g.setStrokeStyle(1);
		g.beginStroke(createjs.Graphics.getRGB(0,255,0));
		g.beginFill(createjs.Graphics.getRGB(255,0,255));
		g.drawCircle(0,0,5);

		this.bounds = 5; 

		this.hit = this.bounds;

	}
	// placer aleatoirement la cible
	p.randomize = function(){
		this.x = Math.random()* canvas.width;
		this.y = Math.random()* canvas.height;
	}

	
	p.tick = function() {

		
		

	}

	

	



window.Target = Target;

}(window));(function(window) {

function Target() {

  this.initialize();

}
//p est un raccourci
var p = Target.prototype = new createjs.Container();

// public properties:


	p.TargetBody;

	



	p.bounds;

	p.hit;

	

// constructor:

	p.Container_initialize = p.initialize;	

	

	p.initialize = function() {

		this.Container_initialize();

		this.TargetBody = new createjs.Shape();

		this.addChild(this.TargetBody);

		this.makeShape();
		
		this.vX = 4;

		this.vY = 4;

	}

	

// public methods:

	p.makeShape = function() {

		//draw Target body

		var g = this.TargetBody.graphics;

		g.clear();

		g.setStrokeStyle(1);
		g.beginStroke(createjs.Graphics.getRGB(0,255,0));
		g.beginFill(createjs.Graphics.getRGB(255,0,255));
		g.drawCircle(0,0,5);

		this.bounds = 5; 

		this.hit = this.bounds;

	}
	// placer aleatoirement la cible
	p.randomize = function(){
		this.x = Math.random()* canvas.width;
		this.y = Math.random()* canvas.height;
	}

	
	p.tick = function() {

		
		

	}

	

	



window.Target = Target;

}(window));(function(window) {

function Target() {

  this.initialize();

}
//p est un raccourci
var p = Target.prototype = new createjs.Container();

// public properties:


	p.TargetBody;

	



	p.bounds;

	p.hit;

	

// constructor:

	p.Container_initialize = p.initialize;	

	

	p.initialize = function() {

		this.Container_initialize();

		this.TargetBody = new createjs.Shape();

		this.addChild(this.TargetBody);

		this.makeShape();
		
		this.vX = 4;

		this.vY = 4;

	}

	

// public methods:

	p.makeShape = function() {

		//draw Target body

		var g = this.TargetBody.graphics;

		g.clear();

		g.setStrokeStyle(1);
		g.beginStroke(createjs.Graphics.getRGB(0,255,0));
		g.beginFill(createjs.Graphics.getRGB(255,0,255));
		g.drawCircle(0,0,5);

		this.bounds = 5; 

		this.hit = this.bounds;

	}
	// placer aleatoirement la cible
	p.randomize = function(){
		this.x = Math.random()* canvas.width;
		this.y = Math.random()* canvas.height;
	}

	
	p.tick = function() {

		
		

	}

	

	



window.Target = Target;

}(window));(function(window) {

function Target() {

  this.initialize();

}
//p est un raccourci
var p = Target.prototype = new createjs.Container();

// public properties:


	p.TargetBody;

	



	p.bounds;

	p.hit;

	

// constructor:

	p.Container_initialize = p.initialize;	

	

	p.initialize = function() {

		this.Container_initialize();

		this.TargetBody = new createjs.Shape();

		this.addChild(this.TargetBody);

		this.makeShape();
		
		this.vX = 4;

		this.vY = 4;

	}

	

// public methods:

	p.makeShape = function() {

		//draw Target body

		var g = this.TargetBody.graphics;

		g.clear();

		g.setStrokeStyle(1);
		g.beginStroke(createjs.Graphics.getRGB(0,255,0));
		g.beginFill(createjs.Graphics.getRGB(255,0,255));
		g.drawCircle(0,0,5);

		this.bounds = 5; 

		this.hit = this.bounds;

	}
	// placer aleatoirement la cible
	p.randomize = function(){
		this.x = Math.random()* canvas.width;
		this.y = Math.random()* canvas.height;
	}

	
	p.tick = function() {

		
		

	}

	

	



window.Target = Target;

}(window));(function(window) {

function Target() {

  this.initialize();

}
//p est un raccourci
var p = Target.prototype = new createjs.Container();

// public properties:


	p.TargetBody;

	



	p.bounds;

	p.hit;

	

// constructor:

	p.Container_initialize = p.initialize;	

	

	p.initialize = function() {

		this.Container_initialize();

		this.TargetBody = new createjs.Shape();

		this.addChild(this.TargetBody);

		this.makeShape();
		
		this.vX = 4;

		this.vY = 4;

	}

	

// public methods:

	p.makeShape = function() {

		//draw Target body

		var g = this.TargetBody.graphics;

		g.clear();

		g.setStrokeStyle(1);
		g.beginStroke(createjs.Graphics.getRGB(0,255,0));
		g.beginFill(createjs.Graphics.getRGB(255,0,255));
		g.drawCircle(0,0,5);

		this.bounds = 5; 

		this.hit = this.bounds;

	}
	// placer aleatoirement la cible
	p.randomize = function(){
		this.x = Math.random()* canvas.width;
		this.y = Math.random()* canvas.height;
	}

	
	p.tick = function() {

		
		

	}

	

	



window.Target = Target;

}(window));(function(window) {

function Target() {

  this.initialize();

}
//p est un raccourci
var p = Target.prototype = new createjs.Container();

// public properties:


	p.TargetBody;

	



	p.bounds;

	p.hit;

	

// constructor:

	p.Container_initialize = p.initialize;	

	

	p.initialize = function() {

		this.Container_initialize();

		this.TargetBody = new createjs.Shape();

		this.addChild(this.TargetBody);

		this.makeShape();
		
		this.vX = 4;

		this.vY = 4;

	}

	

// public methods:

	p.makeShape = function() {

		//draw Target body

		var g = this.TargetBody.graphics;

		g.clear();

		g.setStrokeStyle(1);
		g.beginStroke(createjs.Graphics.getRGB(0,255,0));
		g.beginFill(createjs.Graphics.getRGB(255,0,255));
		g.drawCircle(0,0,5);

		this.bounds = 5; 

		this.hit = this.bounds;

	}
	// placer aleatoirement la cible
	p.randomize = function(){
		this.x = Math.random()* canvas.width;
		this.y = Math.random()* canvas.height;
	}

	
	p.tick = function() {

		
		

	}

	

	



window.Target = Target;

}(window));(function(window) {

function Target() {

  this.initialize();

}
//p est un raccourci
var p = Target.prototype = new createjs.Container();

// public properties:


	p.TargetBody;

	



	p.bounds;

	p.hit;

	

// constructor:

	p.Container_initialize = p.initialize;	

	

	p.initialize = function() {

		this.Container_initialize();

		this.TargetBody = new createjs.Shape();

		this.addChild(this.TargetBody);

		this.makeShape();
		
		this.vX = 4;

		this.vY = 4;

	}

	

// public methods:

	p.makeShape = function() {

		//draw Target body

		var g = this.TargetBody.graphics;

		g.clear();

		g.setStrokeStyle(1);
		g.beginStroke(createjs.Graphics.getRGB(0,255,0));
		g.beginFill(createjs.Graphics.getRGB(255,0,255));
		g.drawCircle(0,0,5);

		this.bounds = 5; 

		this.hit = this.bounds;

	}
	// placer aleatoirement la cible
	p.randomize = function(){
		this.x = Math.random()* canvas.width;
		this.y = Math.random()* canvas.height;
	}

	
	p.tick = function() {

		
		

	}

	

	



window.Target = Target;

}(window));(function(window) {

function Target() {

  this.initialize();

}
//p est un raccourci
var p = Target.prototype = new createjs.Container();

// public properties:


	p.TargetBody;

	



	p.bounds;

	p.hit;

	

// constructor:

	p.Container_initialize = p.initialize;	

	

	p.initialize = function() {

		this.Container_initialize();

		this.TargetBody = new createjs.Shape();

		this.addChild(this.TargetBody);

		this.makeShape();
		
		this.vX = 4;

		this.vY = 4;

	}

	

// public methods:

	p.makeShape = function() {

		//draw Target body

		var g = this.TargetBody.graphics;

		g.clear();

		g.setStrokeStyle(1);
		g.beginStroke(createjs.Graphics.getRGB(0,255,0));
		g.beginFill(createjs.Graphics.getRGB(255,0,255));
		g.drawCircle(0,0,5);

		this.bounds = 5; 

		this.hit = this.bounds;

	}
	// placer aleatoirement la cible
	p.randomize = function(){
		this.x = Math.random()* canvas.width;
		this.y = Math.random()* canvas.height;
	}

	
	p.tick = function() {

		
		

	}

	

	



window.Target = Target;

}(window));