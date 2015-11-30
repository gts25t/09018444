var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Box2D = require('box2dweb-commonjs').Box2D;

var connections = [];
var world;
var SCALE = 30;
var size = 50;
var w = 1000;
var h = 1000;
var fps = 30;
var destroy_list = [];

var D2R = Math.PI/180;
var R2D = 180/Math.PI;
var PI2 = Math.PI*2;
var interval;
var canvas;
var debug = true;

var destory_list = []; // 13

var b2Vec2 = Box2D.Common.Math.b2Vec2
, b2AABB = Box2D.Collision.b2AABB
, b2BodyDef = Box2D.Dynamics.b2BodyDef
, b2Body = Box2D.Dynamics.b2Body
, b2FixtureDef = Box2D.Dynamics.b2FixtureDef
, b2Fixture = Box2D.Dynamics.b2Fixture
, b2World = Box2D.Dynamics.b2World
, b2MassData = Box2D.Collision.Shapes.b2MassData
, b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
, b2DebugDraw = Box2D.Dynamics.b2DebugDraw
, b2MouseJointDef = Box2D.Dynamics.Joints.b2MouseJointDef
, b2EdgeShape = Box2D.Collision.Shapes.b2EdgeShape
;

//function createDOMObjects(x, y, size, circle) { Still 3
function createDOMObjects(x, y, size, circle, user, angle) {
	
	var domObj = {id:user};
	var domPos = {left:x, top:y};
	var width = size/2;
	var height = size/2;

	var x = (domPos.left) + width;
	var y = (domPos.top) + height;
	
	if (user == "bullet") { 	// 12
		var body = createBullet(x, y, width, height, angle);
		body.m_userData = {domObj:domObj, width:width, height:height, circle: circle ? true : false, setup: true};
	} else {
		var body = createBox(x, y, width, height, false, circle);
		body.m_userData = {domObj:domObj, width:width, height:height, circle: circle ? true : false, setup: true};
	}
}

function createBox(x, y, width, height, static, circle, angle) {  //angle added here still 3
	var bodyDef = new b2BodyDef;
	bodyDef.type = static ? b2Body.b2_staticBody : b2Body.b2_dynamicBody;
	bodyDef.position.x = x/SCALE;
	bodyDef.position.y = y/SCALE;

	var fixDef = new b2FixtureDef;
	fixDef.density = 1.5;
	fixDef.friction = 0.01;
	fixDef.restitution = 1;

	if (circle) {
		var circleShape = new b2CircleShape;
		circleShape.m_radius = width/SCALE;
		fixDef.shape = circleShape;
	} else {
		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(width/SCALE, height/SCALE);
	}
	
        bod = world.CreateBody(bodyDef).CreateFixture(fixDef); // 5
	if (static) { //5
		bod.GetBody().SetUserData({id: "boundary"}); //5
	} //5
	return bod; // 5
}

/* Start 12 */
function createBullet(x, y, width, height, angle) {
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = x/SCALE;
	bodyDef.position.y = y/SCALE;

	var fixDef = new b2FixtureDef;
	fixDef.density = 1.5;
	fixDef.friction = 0.01;
	fixDef.restitution = 1;

	var circleShape = new b2CircleShape;
	circleShape.m_radius = width/SCALE;

	fixDef.shape = circleShape;

	a = world.CreateBody(bodyDef).CreateFixture(fixDef);
	a.GetBody().ApplyImpulse(new b2Vec2(Math.cos(angle)*1, Math.sin(angle)*1), a.GetBody().GetWorldCenter());


	return a;
}
/*
function wallSetup(x, y, width, height, static, circle, angle){
	var internalWallDefs = new Array(
	    {8,220,8,220, true}, //1 left top 
        {220,8,220,8, true},   //2 top left 
        {780,8,220,8, true},      //3 
	    {992,220,8,220, true}, //4 
        
        {250,116,8,100, true},   //5 
        {470,150,100,8, true},      //6 
	    {700,200,8,100, true}, //7
        {850,325,8,150, true},   //8
        {125,500,8,100, true},      //9 
	    {378,258,8,100, true}, //10 
        {500,470,50,8, true},   //11 
        {742,550,100,8, true},      //12
        
	    {850,625,8,150, true}, //13
        
        {306,366,80,8, true},   //14
        {330,600,8,100, true},      //15
	    {992,780,8,220, true}, //16
        {8,780,8,220, true},   //17
        {270,860,100,8, true},  //18
        
	    {568,884,8,100, true}, //19
        
        {220,992,220,8, true},   //20
        {780,992,220,8, true}
     );     //right
   var internalWall = new Array();
   for (var i = 0; i <internalWallDefs.length; i++) {
        var internalWallDef = new b2BodyDef;
        internalWallDef.type = b2Body.b2_staticBody;
        internalWallDef.position.Set(internalWallDefs[i].x, internalWallDefs[i].y);
        var newWall = world.CreateBody(internalWallDef)
        var internalWallFixture = new b2FixtureDef;
        internalWallFixture.density = 10.0;
        internalWallFixture.friction = 0.5;
        internalWallFixture.restitution = 0;
        internalWallFixture.shape = new b2PolygonShape;
        internalWallFixture.shape.SetAsBox(internalWallDefs[i].w, internalWallDefs[i].h);
        newWall.CreateFixture(internalWallFixture);
        internalWall.push(newWall);
        var internal = world.CreateBody(internalWallDef).CreateFixture(internalWallFixture);
        internal.GetBody().SetUserData({id: "internal"});
     //   console.log(internal);
   }
}*/
/* End 12 */

var move = false; //See 9
var bodies = {}; //See 9

/* Start 10 */
function getBody(connections) {
	for (var i = 0; i < connections.length; i++) {
		for (var b = world.GetBodyList(); b; b = b.m_next) {
			for (var f = b.m_fixtureList; f; f = f.m_next) {
				if (typeof f.GetUserData() !== "undefined" && f.GetUserData() !=null && f.GetUserData().domObj.id == connections[i].id) {
					bodys = b;
					bodies[connections[i].id] = bodys;
				}
			}
		}
	}
}
/* End 10 */

function drawDOMObjects() {
	var ret = [];
	var i = 0;
	for (var b = world.m_bodyList; b; b = b.m_next) {
	 
	 for (var f = b.m_fixtureList; f; f = f.m_next) {
	  if (f.m_userData) {
	   var x = Math.floor((f.m_body.m_xf.position.x*SCALE) - f.m_userData.width);
	   var y = Math.floor((f.m_body.m_xf.position.y*SCALE) - f.m_userData.height);
	   
	   var r = Math.round(((f.m_body.m_sweep.a + PI2) % PI2) * R2D * 100) /100;
           var css = { '-webkit-transform':'translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg)', 
			'-moz-transform':'translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg)', 
			'-ms-transform':'translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg)',
			'-o-transform':'translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg)',
			'transform':'translate(' + x + 'px, ' + y + 'px) rotate(' + r + 'deg)'};
           if (f.m_userData.circle) {
                 css['-webkit-border-radius'] = css['-moz-border-radius'] = css['border-radius'] = f.m_userData.width + 'px';
	   }
	   css['width'] = (f.m_userData.width * 2) + 'px';
	   css['height'] = (f.m_userData.height * 2) + 'px';
           f.m_userData.setup = false;
	   ret.push(css);
	  }
         }
        }
    return ret;
};

function update(connections) {
	world.Step(
	1/fps,
	10,
	10);

        /* 13*/
	for (var i in destroy_list) {
		world.DestroyBody(destroy_list[i]);
	}

	destroy_list.length = 0;
	//console.log(drawDOMObjects().length);
	io.sockets.emit('css', drawDOMObjects());
	world.ClearForces();
}

function init(connections) {
	world = new b2World(
		new b2Vec2(0, 0),  //Set gravity to zero 1
		true
		);


	//console.log(connections);
/* Start 3 */
createDOMObjects(100, 100, size, false, connections[0].id, 0);
createDOMObjects(600, 800, size, false, connections[1].id, 0);
/* End 3 */


createBox(0, 0, w, 5, true);
createBox(0, h, w, 5, true);
createBox(0, 0, 5, h, true);
createBox(w, 0, 5, h, true);
createBox(8, 220, 8, 220, true);  //1 left top 
createBox(220, 8, 220, 8, true);   //2 top left 
createBox(780, 8, 220, 8, true);   //3 
createBox(992, 220, 8, 220, true); //4 
createBox(250, 116, 8, 100, true);   //5 
createBox(470, 150, 100, 8, true);      //6 
createBox(700, 200, 8, 100, true); //7
createBox(850, 325, 8, 150, true);   //8
createBox(125, 500, 8, 100, true);      //9 
createBox(378, 258, 8, 100, true); //10 
createBox(500, 470, 50, 8, true);   //11 
createBox(742, 550, 100, 8, true);      //12
createBox(850, 625, 8, 150, true); //13
createBox(306, 366, 80, 8, true);   //14
createBox(330, 600, 8, 100, true);      //15
createBox(992, 780, 8, 220, true); //16
createBox(8, 780, 8, 220, true);   //17
createBox(270, 860, 100, 8, true);  //18
createBox(568, 884, 8, 100, true); //19
createBox(220, 992, 220, 8, true);   //20
createBox(780, 992, 220, 8, true); //21

	interval = setInterval(function() {
		update(connections);
	}, 1000/fps);
	getBody(connections); //See 10
	/*Start 11*/
	var listener = new Box2D.Dynamics.b2ContactListener;
	listener.BeginContact = function(contact) {
		AA = contact.GetFixtureA().m_userData
		BA = contact.GetFixtureB().m_userData
		AB = contact.GetFixtureA().GetBody().GetUserData();
		BB = contact.GetFixtureB().GetBody().GetUserData();
		if ((AA != null && BB != null)) {
			if (AA.domObj.id == "bullet" && BB.id == "boundary") {
				//console.log("Destroy")
				destroy_list.push(contact.GetFixtureA().GetBody());
			}
		} else if ((BA != null && AB != null)) {
			if (BA.domObj.id == "bullet" && AB.id == "boundary") {
				//console.log("Destroy");
				destroy_list.push(contact.GetFixtureB().GetBody())
			}
		}
	}
	world.SetContactListener(listener);
	/*End 11*/
	update(connections);
}

app.use(express.static('public'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/css', express.static(__dirname + 'public/css'));

http.listen(8000, function() {
	console.log('listening on *:8000');
	io.on('connection', function (socket) {
		connections.push(socket);
		/* Start 1 */
		console.log("Player", connections.length, "has connected");
		/* End 1  */
		/* Start 2 */
		io.sockets.emit('player_signup', {no_of_players: connections.length});
		if (connections.length == 2) {
			init(connections);
		}
		/* End 2 */

		/*Start 6*/
		socket.on("disconnect", onClientDisconnect);
		socket.on("move player", onMovePlayer);
		/*End 6*/
	});
});

/* Start 7 */
function onClientDisconnect() {
	console.log("Player", connections.length, "has disconnected")
	var playerToBeRemoved = playerById(this.id); //See 8
	connections.length -= 1;
	//TODO: finish
}
/* End 7 */

/* Start 8 */
function playerById(id) {
	var i;
	for (i = 0; i < connections.length; i++) {
		if (connections[i].id == id) {
			return connections[i];
		}
	};
	return false; 
};
/* End 8 */

/* Start 9 */
function onMovePlayer(data) {
	var movePlayer = playerById(this.id);
	
	//console.log(this.id);

	var velocity = 3;
	var v_x = Math.cos(bodies[this.id].GetAngle())*velocity;
	var v_y = Math.sin(bodies[this.id].GetAngle())*velocity;

	if (data.left) {
		bodies[this.id].ApplyTorque(-5);
	}
	if (data.right) {
		bodies[this.id].ApplyTorque(5);
	}
	if (data.up) {
		bodies[this.id].SetLinearVelocity(new b2Vec2(v_x, v_y));
	}
	if (data.down) {
		//TODO: go backwards like above
	}
	if (data.fire) {
		spawn(bodies[this.id].GetPosition().x*SCALE, bodies[this.id].GetPosition().y*SCALE, bodies[this.id].GetAngle()); //12
		
	}
	if (data.left == false && data.right == false && data.down == false && data.up == false) {
		bodies[this.id].SetLinearVelocity(new b2Vec2(0,0));
		bodies[this.id].SetAngularVelocity(0);
	}
	
}
/* End 9 */

function spawn(x, y, angle) {
	createDOMObjects(x, y, 10, true, "bullet", angle);
}
