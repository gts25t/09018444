var vWidth = $('#cover').width();
var vHeight = $('#cover').height();
var dWidth = $('#box2dCanvas').width();
var vHeight = $('#box2dCanvas').height();
var context = document.getElementById('box2dCanvas').getContext('2d');
/*
topLeft = false;
topRight = false;
bottomLeft = false;
bottomRight = true;

var translateX;
var translateY;

if(topLeft){
    translateX = 0;
    translateY = 0;
    context.translate(translateX,translateY);
} else if (topRight){
    translateX = -500;
    translateY = 0;
    context.translate(translateX,translateY);
}else if (bottomLeft){
    translateX = 0;
    translateY = -500;
    context.translate(translateX,translateY);
}else if (bottomRight){
    translateX = -500;
    translateY = -500;
    context.translate(translateX,translateY);
}
*/
$(window).keydown(function(e){
    console.log(e.keyCode);
    if (e.keyCode == 37){
        console.log("left-down");
        left();
    }
    if (e.keyCode == 39){
        console.log("right-down");
        right();
    }
    if (e.keyCode == 38){
        console.log("up-down");
        up();
    }
    if (e.keyCode == 40){
        console.log("down-down");
        down();
    }
        if (e.keyCode == 32){
        console.log("fire-up");
        fire();
    }
        if (e.keyCode == 68){
        console.log("destroy");
        destroy_list.push(spawntest.GetBody());
    }
});

$(window).keyup(function(e){
    console.log(e.keyCode);
    if (e.keyCode == 37){
        console.log("left-up");
        stop();
    }
    if (e.keyCode == 39){
        console.log("right-up");
        stop();
    }
    if (e.keyCode == 38){
        console.log("up-up");
        stop();
    }
    if (e.keyCode == 40){
        console.log("down-up");
        stop();
    }
    if (e.keyCode == 32){
        console.log("fire-down");
    }
});

var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

world = new b2World(
    new b2Vec2(0,0),
    false
);

var CANVAS_WIDTH = 1000;
var CANVAS_HEIGHT = 1000;
var SCALE = 30; // recommended

var destroy_list = [];
var health = 100;
var lives = 3;

var surroundDef = new Array(
	    {x:CANVAS_WIDTH/SCALE,y:CANVAS_HEIGHT/SCALE,w:CANVAS_WIDTH/SCALE,h:1/SCALE}, //bottom
        {x:CANVAS_WIDTH/SCALE,y:0,w:CANVAS_HEIGHT/SCALE,h:1/SCALE},   //top
        {x:0,y:CANVAS_HEIGHT/SCALE,w:1/SCALE ,h:CANVAS_HEIGHT/SCALE},      //left
        {x:CANVAS_WIDTH/SCALE,y:CANVAS_HEIGHT/SCALE,w:1/SCALE,h:CANVAS_HEIGHT/SCALE}
     );     //right
   var walls = new Array();
   for (var i = 0; i <surroundDef.length; i++) {
        var wallDef = new b2BodyDef;
        wallDef.type = b2Body.b2_staticBody;
        wallDef.position.Set(surroundDef[i].x, surroundDef[i].y);
        var newWall = world.CreateBody(wallDef)
        var wallFixture = new b2FixtureDef;
        wallFixture.density = 10.0;
        wallFixture.friction = 0.5;
        wallFixture.restitution = 0;
        wallFixture.shape = new b2PolygonShape;
        wallFixture.shape.SetAsBox(surroundDef[i].w, surroundDef[i].h);
        newWall.CreateFixture(wallFixture);
        walls.push(newWall);
        var surround = world.CreateBody(wallDef).CreateFixture(wallFixture);
        surround.GetBody().SetUserData({id: "surround"});
        console.log(surround.GetBody());
   }
var internalWallDefs = new Array(
	    {x:8/SCALE,y:220/SCALE,w:8/SCALE,h:220/SCALE}, //1 left top 
        {x:220/SCALE,y:8/SCALE,w:220/SCALE,h:8/SCALE},   //2 top left 
        {x:780/SCALE,y:8/SCALE,w:220/SCALE,h:8/SCALE},      //3 
	    {x:992/SCALE,y:220/SCALE,w:8/SCALE,h:220/SCALE}, //4 
        
        {x:250/SCALE,y:116/SCALE,w:8/SCALE,h:100/SCALE},   //5 
        {x:470/SCALE,y:150/SCALE,w:100/SCALE,h:8/SCALE},      //6 
	    {x:700/SCALE,y:200/SCALE,w:8/SCALE,h:100/SCALE}, //7
        {x:850/SCALE,y:325/SCALE,w:8/SCALE,h:150/SCALE},   //8
        {x:125/SCALE,y:500/SCALE,w:8/SCALE,h:100/SCALE},      //9 
	    {x:378/SCALE,y:258/SCALE,w:8/SCALE,h:100/SCALE}, //10 
        {x:500/SCALE,y:470/SCALE,w:50/SCALE,h:8/SCALE},   //11 
        {x:742/SCALE,y:550/SCALE,w:100/SCALE,h:8/SCALE},      //12
        
	    {x:850/SCALE,y:625/SCALE,w:8/SCALE,h:150/SCALE}, //13
        
        {x:306/SCALE,y:366/SCALE,w:80/SCALE,h:8/SCALE},   //14
        {x:330/SCALE,y:600/SCALE,w:8/SCALE,h:100/SCALE},      //15
	    {x:992/SCALE,y:780/SCALE,w:8/SCALE,h:220/SCALE}, //16
        {x:8/SCALE,y:780/SCALE,w:8/SCALE,h:220/SCALE},   //17
        {x:270/SCALE,y:860/SCALE,w:100/SCALE,h:8/SCALE},  //18
        
	    {x:568/SCALE,y:884/SCALE,w:8/SCALE,h:100/SCALE}, //19
        
        {x:220/SCALE,y:992/SCALE,w:220/SCALE,h:8/SCALE},   //20
        {x:780/SCALE,y:992/SCALE,w:220/SCALE,h:8/SCALE
        });

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
   //    console.log(internal.GetBody().GetUserData());
   }

var fixDef = new b2FixtureDef;
fixDef.density = 1.0;
fixDef.friction = 0.5;
fixDef.restitution = 0;

//==================================================
var bodyDefUser = new b2BodyDef;
bodyDefUser.type = b2Body.b2_dynamicBody;
bodyDefUser.position.x = 100/SCALE;
bodyDefUser.position.y = 100/SCALE;
fixDef.shape = new b2PolygonShape;
fixDef.shape.SetAsBox((50/SCALE)/2, (50/SCALE)/2);
var user = world.CreateBody(bodyDefUser).CreateFixture(fixDef);
user.GetBody().SetUserData({id: "user1"});
//console.log(user.GetBody().GetUserData());
         
var bodyDefUser = new b2BodyDef;
bodyDefUser.type = b2Body.b2_dynamicBody;
bodyDefUser.position.x = 900/SCALE;
bodyDefUser.position.y = 100/SCALE;
fixDef.shape = new b2PolygonShape;
fixDef.shape.SetAsBox((50/SCALE)/2, (50/SCALE)/2);
var user = world.CreateBody(bodyDefUser).CreateFixture(fixDef);
user.GetBody().SetUserData({id: "user2"});
//console.log(user.GetBody().GetUserData());

var bodyDefUser = new b2BodyDef;
bodyDefUser.type = b2Body.b2_dynamicBody;
bodyDefUser.position.x = 100/SCALE;
bodyDefUser.position.y = 900/SCALE;
fixDef.shape = new b2PolygonShape;
fixDef.shape.SetAsBox((50/SCALE)/2, (50/SCALE)/2);
var user = world.CreateBody(bodyDefUser).CreateFixture(fixDef);
user.GetBody().SetUserData({id: "user3"});
//console.log(user.GetBody().GetUserData());

var bodyDefUser = new b2BodyDef;
bodyDefUser.type = b2Body.b2_dynamicBody;
bodyDefUser.position.x = 900/SCALE;
bodyDefUser.position.y = 900/SCALE;
fixDef.shape = new b2PolygonShape;
fixDef.shape.SetAsBox((50/SCALE)/2, (50/SCALE)/2);
var user = world.CreateBody(bodyDefUser).CreateFixture(fixDef);
user.GetBody().SetUserData({id: "user4"});
//console.log(user.GetBody().GetUserData());

//==================================================
/*
var bodyDefGun = new b2BodyDef;
bodyDefGun.type = b2Body.b2RevoluteJointDef;
bodyDefGun.position.x = 120/SCALE;
bodyDefGun.position.y = 100/SCALE;
fixDef.shape = new b2PolygonShape;
fixDef.shape.SetAsBox((30/SCALE)/2, (5/SCALE)/2);
var gun = world.CreateBody(bodyDefGun).CreateFixture(fixDef);
gun.GetBody().SetUserData({id: "gun"});
console.log(gun.GetBody().GetUserData());

joint = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
joint.Initialize(user.GetBody(), gun.GetBody(), user.GetBody().GetWorldCenter(), gun.GetBody().GetWorldCenter());

Revjoint = world.CreateJoint(joint);
*/
//================================================

var posX = [];
var posY = [];
posX[0] = user.GetBody().GetWorldCenter().x*30;
posY[0] = user.GetBody().GetWorldCenter().y*30;

var debugDraw = new b2DebugDraw();
debugDraw.SetSprite(context);
debugDraw.SetDrawScale(SCALE);
debugDraw.SetFillAlpha(0.3);
debugDraw.SetLineThickness(1.0);
debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_joinBit);
world.SetDebugDraw(debugDraw);


function update(){
    world.Step(
        1/60            // frame rate
        , 10            // velocity iterations
        , 10            //position iteration
    );
    world.DrawDebugData();
    world.ClearForces();
    
    for (var i in destroy_list) {
        world.DestroyBody(destroy_list[i]);
    }
    // reset array
    destroy_list.length = 0;
    
    
    pX = user.GetBody().GetWorldCenter().x*30;
    pY = user.GetBody().GetWorldCenter().y*30;
    posX.push(pX);
    posY.push(pY);
    
    var length = posX.length;
    
    var sX = (posX[length-1]-posX[length-2]);
    var sY = (posY[length-1]-posY[length-2]);
    if(pX > 275 && pX < 750){
    context.translate(-sX, 0);
    }
    if (pY > 275 && pY < 750){
    context.translate(0, -sY);
    }
    
    
    window.requestAnimationFrame(update);
};      // update

window.requestAnimationFrame(update);


// left

function left() {
    user.GetBody().SetAngularVelocity(-0.5);
    /*
        if(translateX >= -500 && translateX < 0){
        translateX = translateX+10;
        context.translate(10,0); 
    }
     */
}

// right

function right(){
    user.GetBody().SetAngularVelocity(0.5);
    /*
     *        translateX = translateX-10;
        context.translate(-10,0); 
     */
}
// up

function up() {
    user.GetBody().ApplyImpulse(new b2Vec2(1*Math.cos(user.GetBody().GetAngle()), 1*Math.sin(user.GetBody().GetAngle())), user.GetBody().GetWorldCenter());
    //user.GetBody().ApplyImpulse(new b2Vec2(0,-5), user.GetBody().GetWorldCenter());
    /*
     *    translateX = translateX-10;
    context.translate(-10,0);
     */
}
// down

function down(){
        user.GetBody().ApplyImpulse(new b2Vec2(-1*Math.cos(user.GetBody().GetAngle()), -1*Math.sin(user.GetBody().GetAngle())), user.GetBody().GetWorldCenter());
     //   user.GetBody().ApplyImpulse(new b2Vec2(0, 5), user.GetBody().GetWorldCenter());
    /*
     *       translateY = translateY-10;
    context.translate(0,-10);
     */
}
// stop

function stop() {
   
    user.GetBody().SetLinearVelocity(new b2Vec2(0, user.GetBody().GetLinearVelocity().y));
    user.GetBody().SetLinearVelocity(new b2Vec2(user.GetBody().GetLinearVelocity().x),0);
   // user.GetBody().SetLinearVelocity(0, 0);
    user.GetBody().SetAngularVelocity(0)
}

function fire(){
    fixDef.shape = new b2CircleShape(0.1);
    fixDef.density = 1;
    fixDef.restitution = 0.1;
    var bodyDefBullet = new b2BodyDef;
    bodyDefBullet.type = b2Body.b2_dynamicBody;
    bodyDefBullet.position.x = (user.GetBody().GetPosition().x + 1*Math.cos(user.GetBody().GetAngle()));
    bodyDefBullet.position.y = (user.GetBody().GetPosition().y + 1*Math.sin(user.GetBody().GetAngle()));
    var bullet = world.CreateBody(bodyDefBullet).CreateFixture(fixDef);
    bullet.GetBody().SetUserData({id: "bullet"});
//    console.log(bullet.GetBody().GetUserData())
    velocity = 1;
    bullet.GetBody().ApplyImpulse(new b2Vec2(velocity*Math.cos(user.GetBody().GetAngle()), velocity*Math.sin(user.GetBody().GetAngle())), bullet.GetBody().GetWorldCenter());


}
/*
window.setInterval(removeObjectScheduleRemoval, 1000/90);
var bulletScheduleRemoval = array();
var index = -1; 
function removeObjectScheduleRemoval(){
    for (var i = 0; i <= index; i++){
        world.DestroyBody(bulletScheduleRemoval[i]);
        bulletScheduleRemoval[i] = null;
    }
    bulletScheduleRemoval = array();
    index = -1

}
*/


var c = document.getElementById("health");
var ctx = context;
ctx.font="20px serif";
ctx.fillStyle="#ffffff";
ctx.fillText("Health: "+ health, 10, 40);

var listener = new Box2D.Dynamics.b2ContactListener;

listener.BeginContact = function(contact) {
               console.log(health);
               console.log(contact);
               console.log(contact.GetFixtureA().GetBody().GetUserData() + '-' + contact.GetFixtureB().GetBody().GetUserData());
       if (contact.GetFixtureA().GetBody().GetUserData() != null && contact.GetFixtureB().GetBody().GetUserData() != null) {
    /*    if ((contact.GetFixtureA().GetBody().GetUserData().id == "user1" && contact.GetFixtureB().GetBody().GetUserData().id == "bullet") ||(contact.GetFixtureA().GetBody().GetUserData().id == "user2" && contact.GetFixtureB().GetBody().GetUserData().id == "bullet") ||(contact.GetFixtureA().GetBody().GetUserData().id == "user3" && contact.GetFixtureB().GetBody().GetUserData().id == "bullet")||(contact.GetFixtureA().GetBody().GetUserData().id == "user4" && contact.GetFixtureB().GetBody().GetUserData().id == "bullet")){
            health --;
            if (health == 0) {
                console.log(health);
               destroy_list.push(contact.GetFixtureA().GetBody());

            }
        } */
        if ((contact.GetFixtureA().GetBody().GetUserData().id == "user1" && contact.GetFixtureB().GetBody().GetUserData().id == "bullet") ||(contact.GetFixtureA().GetBody().GetUserData().id == "user2" && contact.GetFixtureB().GetBody().GetUserData().id == "bullet") ||(contact.GetFixtureA().GetBody().GetUserData().id == "user3" && contact.GetFixtureB().GetBody().GetUserData().id == "bullet")||(contact.GetFixtureA().GetBody().GetUserData().id == "user4" && contact.GetFixtureB().GetBody().GetUserData().id == "bullet")){
            health --;
            if (health == 0) {
                lives --;
                destroy_list.push(contact.GetFixtureA().GetBody());
                location.reload();
                if (lives == 0){
                    alert( username, "\nYou are dead, \nGame Over");
                }
            }
        }
        if ((contact.GetFixtureA().GetBody().GetUserData().id == "bullet" && contact.GetFixtureB().GetBody().GetUserData().id == "bullet")||(contact.GetFixtureA().GetBody().GetUserData().id == "bullet" && contact.GetFixtureB().GetBody().GetUserData().id == "surround")||(contact.GetFixtureA().GetBody().GetUserData().id == "bullet" && contact.GetFixtureB().GetBody().GetUserData().id == "user1")||(contact.GetFixtureA().GetBody().GetUserData().id == "bullet" && contact.GetFixtureB().GetBody().GetUserData().id == "user2")||(contact.GetFixtureA().GetBody().GetUserData().id == "bullet" && contact.GetFixtureB().GetBody().GetUserData().id == "user3")||(contact.GetFixtureA().GetBody().GetUserData().id == "bullet" && contact.GetFixtureB().GetBody().GetUserData().id == "user4"))  {
	    destroy_list.push(contact.GetFixtureA().GetBody());
     //   console.log(contact.GetFixtureA().GetBody().GetUserData().id + " - " + contact.GetFixtureB().GetBody().GetUserData().id);
    console.log(contact);      
        }

       if ((contact.GetFixtureA().GetBody().GetUserData().id == "bullet" && contact.GetFixtureB().GetBody().GetUserData().id == "bullet")||(contact.GetFixtureA().GetBody().GetUserData().id == "surround" && contact.GetFixtureB().GetBody().GetUserData().id == "bullet")||(contact.GetFixtureA().GetBody().GetUserData().id == "user1" && contact.GetFixtureB().GetBody().GetUserData().id == "bullet")||(contact.GetFixtureA().GetBody().GetUserData().id == "user2" && contact.GetFixtureB().GetBody().GetUserData().id == "bullet")||(contact.GetFixtureA().GetBody().GetUserData().id == "user3" && contact.GetFixtureB().GetBody().GetUserData().id == "bullet")||(contact.GetFixtureA().GetBody().GetUserData().id == "user4" && contact.GetFixtureB().GetBody().GetUserData().id == "bullet")||(contact.GetFixtureA().GetBody().GetUserData().id == "surround" && contact.GetFixtureB().GetBody().GetUserData().id == "bullet")) {
	    destroy_list.push(contact.GetFixtureB().GetBody());
    //    console.log(contact.GetFixtureA().GetBody().GetUserData() + " - " + contact.GetFixtureB().GetBody().GetUserData());
       }
    
    }
    
listener.EndContact = function(contact) {

}
}

this.world.SetContactListener(listener);