// constances
const canvas = document.getElementById('screen');
const context = canvas.getContext('2d',{
  willReadFrequently: true,
});
const WIDTH = 400;
const HEIGHT = 400;
const DOUBLE_PI = 2 * Math.PI;
const HALF_PI = Math.PI/2;
const FPS = 60;
const cycleDelay = Math.floor(1000 / FPS);
const roomBoarder = 0.05;
// images
var base_image = new Image();
base_image.src = "assests/images/exit.png";

var startInfo = new Image()
startInfo.src = "assests/images/start.png";
var startInfo2 = new Image()
startInfo2.src = "assests/images/start2.png";

var imgages = 1
var decorationImages = []
for (let img = 1; img <= imgages; img++) {
	var curImage = new Image();
	curImage.src = "assests/decorations/"+img+".png";
	decorationImages.push(curImage)
}

//classes
class runner {
	constructor () {
		this.speed = player.speed*0.7*(randInt(800,1200)/1000)
		this.position = new vector2(Math.floor(player.position.x / roomSize.x)*roomSize.x+randInt(roomSize.x*0.1,roomSize.x*0.9),Math.floor(player.position.y / roomSize.y)*roomSize.y+randInt(roomSize.y*0.1,roomSize.y*0.9))
		this.img = new Image();
		this.img.src = "assests/enemys/runner.png";
		this.size = new vector2(roomSize.x/10,roomSize.y/10)
	}

	update() {
		if (((this.position.x-player.position.x)**2+(this.position.y-player.position.y)**2)**0.5 >= (this.size.y+this.size.x)/2) {
			this.position.x -= Math.sin(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed
			this.position.y -= Math.cos(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed
		} else {
			player.vx -= Math.sin(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed/4
			player.vy -= Math.cos(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed/4
			curShake = 1
			player.health -= 1
		}
		context.drawImage(this.img,this.position.x + mapOffset.x - this.size.x / 2,this.position.y + mapOffset.y - this.size.y/2,this.size.x,this.size.y)
	}
}

class ghost {
	constructor () {
		this.speed = player.speed*0.7*(randInt(800,1200)/1000)
		this.position = new vector2(Math.floor(player.position.x / roomSize.x)*roomSize.x+randInt(roomSize.x*0.1,roomSize.x*0.9),Math.floor(player.position.y / roomSize.y)*roomSize.y+randInt(roomSize.y*0.1,roomSize.y*0.9))
		this.img = new Image();
		this.img.src = "assests/enemys/ghost.png";
		this.size = new vector2(roomSize.x/10,roomSize.y/10)
	}

	update() {
		if (((this.position.x-mouse.x + mapOffset.x)**2+(this.position.y-mouse.y + mapOffset.y)**2)**0.5 >= (this.size.x)/2) {
			this.position.x -= Math.sin(Math.atan2(this.position.x - mouse.x + mapOffset.x,this.position.y - mouse.y + mapOffset.y))/16*this.speed
			this.position.y -= Math.cos(Math.atan2(this.position.x - mouse.x + mapOffset.x,this.position.y - mouse.y + mapOffset.y))/16*this.speed
		} else {
			curShake = 1
			player.health -= 1.5
		}
		context.drawImage(this.img,this.position.x + mapOffset.x - this.size.x / 2,this.position.y + mapOffset.y - this.size.y/2,this.size.x,this.size.y)
	}
}

class shooter {
	constructor () {
		this.speed = player.speed*0.7*(randInt(800,1200)/1000)
		this.position = new vector2(Math.floor(player.position.x / roomSize.x)*roomSize.x+randInt(roomSize.x*0.1,roomSize.x*0.9),Math.floor(player.position.y / roomSize.y)*roomSize.y+randInt(roomSize.y*0.1,roomSize.y*0.9))
		this.side = randInt(1,4)
		this.img = new Image();
		this.img.src = "assests/enemys/shooter.png";
		this.size = new vector2(roomSize.x/10,roomSize.y/10)
		this.canShoot = false
		this.shootLimti = randInt(30,90)
		this.count = randInt(1,Math.floor(this.shootLimti/2))
	}

	update() {
		this.count++;
		if (this.count >= this.shootLimti) this.count = 0;
		if (this.count % this.shootLimti == 0) this.canShoot = true

		if (this.side == 1 || this.side == 3) {
			this.position.x = lerp(this.position.x,player.position.x,0.01*(this.speed/16))
		} else {
			this.position.y = lerp(this.position.y,player.position.y,0.01*(this.speed/16))
		}


		if (this.side == 1) {
			this.position.y = Math.floor(player.position.y / roomSize.y) * roomSize.y + roomSize.y*0.9
		}if (this.side == 2){
			this.position.x = Math.floor(player.position.x / roomSize.x) * roomSize.x + roomSize.x*0.1
		}if (this.side == 3){
			this.position.y = Math.floor(player.position.y / roomSize.y) * roomSize.y + roomSize.y*0.1
		}if (this.side == 4){
			this.position.x = Math.floor(player.position.x / roomSize.x) * roomSize.x + roomSize.x*0.9
		}

		if (this.canShoot) {
			this.canShoot = !this.canShoot

			var a = bullets.push(new bullet(this.side,"enemy"))
			bullets[a-1].position.x = this.position.x
			bullets[a-1].position.y = this.position.y
		}
		context.drawImage(this.img,this.position.x + mapOffset.x - this.size.x / 2,this.position.y + mapOffset.y - this.size.y/2,this.size.x,this.size.y)
	}
}

class sheilder {
	constructor () {
		this.speed = player.speed*0.7*(randInt(800,1200)/1000)
		this.position = new vector2(Math.floor(player.position.x / roomSize.x)*roomSize.x+randInt(roomSize.x*0.1,roomSize.x*0.9),Math.floor(player.position.y / roomSize.y)*roomSize.y+randInt(roomSize.y*0.1,roomSize.y*0.9))
		this.img = new Image();
		this.img.src = "assests/enemys/runner.png";
		this.size = new vector2(roomSize.x/10,roomSize.y/10)
		this.countLimti = randInt(30,90)
		this.count = randInt(1,Math.floor(this.countLimti/2))
		this.sheild = false
		this.anggle = 0
	}
	
	update() {
		this.count++;
		if (this.count >= this.countLimti) this.count = 0;
		if (this.count % this.countLimti == 0) {
			this.sheild = !this.sheild
			if (this.sheild == true) {
				this.speed /= 2
			} else {
				this.speed *= 2
			}
		}
		if (this.sheild == true) { 

			this.anggle = Math.atan2(player.position.x-this.position.x,player.position.y-this.position.y)-Math.PI/2
			context.beginPath();
	    context.strokeStyle = "#0000000";
	    context.arc((this.position.x + mapOffset.x),(this.position.y + mapOffset.y),roomSize.x/20*2,-this.anggle-Math.PI/4,-this.anggle+Math.PI/4);
	    context.lineWidth = roomSize.x/10
			context.stroke();

		}

		//move and draw
		if (((this.position.x-player.position.x)**2+(this.position.y-player.position.y)**2)**0.5 >= (this.size.y+this.size.x)/2) {
			this.position.x -= Math.sin(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed
			this.position.y -= Math.cos(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed
		} else {
			player.vx -= Math.sin(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed/4
			player.vy -= Math.cos(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed/4
			curShake = 1
			player.health -= 1
		}
		context.drawImage(this.img,this.position.x + mapOffset.x - this.size.x / 2,this.position.y + mapOffset.y - this.size.y/2,this.size.x,this.size.y)
	}
}

class vector2 {
	constructor(p1=0,p2=0) {
		this.x = p1;
		this.y = p2;
	}
	one(){
		this.x = 1;
		this.y = 1;
	}
	multiply(amt){
		this.x *= amt;
		this.y *= amt;
	}
}

class rect {
	constructor(pos,size, rotation = 0) {
		this.position = pos;
		this.size = size;
		this.rotation = rotation;

	}
	draw(color = "Black") {
		context.fillStyle = color;
		context.fillRect(
			canvas.width / 2 - roomSize.x/2 + this.position.x,
			canvas.height / 2 - roomSize.y/2 + this.position.y,
			this.size.x, this.size.y);
	}
}

class room {
	constructor(name = "",base = new rect(new vector2(),new vector2(roomSize.x,roomSize.y)),roomData) {
		this.name = name;
		this.base = base;
		this.roomData = roomData;
		this.entered = false;
		this.next = false;
	}
	
	draw(){
		var rec2 = new rect(new vector2(this.base.position.x + this.base.size.x * roomBoarder - camOffset.x,this.base.position.y + this.base.size.y * roomBoarder - camOffset.y), new vector2(roomSize.x-roomSize.x*(roomBoarder*2),roomSize.y-roomSize.y*(roomBoarder*2)))
		
		// entered
		if (this.entered) {
			rec2.draw("#dadada")
			for (let exit in this.roomData[1]) {
				if (this.roomData[1][exit] == 1) {
				  var pos = new vector2(this.base.position.x + roomSize.x / 2 - roomSize.x / 20  - camOffset.x,this.base.position.y - camOffset.y)
				  var size = new vector2(roomSize.x/10,roomSize.y/10)
				  var rec = new rect(pos,size)
				  if (enemys.length == 0) {
					  rec.draw("#dadada")
				  }
				}
				if (this.roomData[1][exit] == 2) {
				  var pos = new vector2(this.base.position.x + roomSize.x - roomSize.x / 20 - camOffset.x,this.base.position.y + roomSize.x / 2 - roomSize.y / 20 - camOffset.y)
				  var size = new vector2(roomSize.x/10,roomSize.y/10)
				  var rec = new rect(pos,size)
				  if (enemys.length == 0) {
					  rec.draw("#dadada")
				  }
				}
				if (this.roomData[1][exit] == 3) {
				  var pos = new vector2(this.base.position.x + roomSize.x / 2 - roomSize.x / 20 - camOffset.x,this.base.position.y + roomSize.y - roomSize.y / 20 - camOffset.y)
				  var size = new vector2(roomSize.x/10,roomSize.y/10)
				  var rec = new rect(pos,size)
				  if (enemys.length == 0) {
					  rec.draw("#dadada")
				  }
				}
				if (this.roomData[1][exit] == 4) {
				  var pos = new vector2(this.base.position.x - camOffset.x,this.base.position.y + roomSize.x / 2 - roomSize.y / 20 - camOffset.y)
				  var size = new vector2(roomSize.x/10,roomSize.y/10)
				  var rec = new rect(pos,size)
				  if (enemys.length == 0) {
					  rec.draw("#dadada")
				  }
				}
			}
			for (let exit in this.roomData[2]) {
				if (this.roomData[2][exit] == 1) {
				  var pos = new vector2(this.base.position.x+roomSize.x/2-roomSize.x/20 - camOffset.x,this.base.position.y - camOffset.y)
				  var size = new vector2(roomSize.x/10,roomSize.y/10)
				  var rec = new rect(pos,size)
				  rec.draw("#dadada")
				}
				if (this.roomData[2][exit] == 2) {
				  var pos = new vector2(this.base.position.x+roomSize.x-roomSize.x/20 - camOffset.x,this.base.position.y+roomSize.x/2-roomSize.y/20 - camOffset.y)
				  var size = new vector2(roomSize.x/10,roomSize.y/10)
				  var rec = new rect(pos,size)
				  rec.draw("#dadada")
				}
				if (this.roomData[2][exit] == 3) {
				  var pos = new vector2(this.base.position.x+roomSize.x/2-roomSize.x/20 - camOffset.x,this.base.position.y+roomSize.y-roomSize.y/20 - camOffset.y)
				  var size = new vector2(roomSize.x/10,roomSize.y/10)
				  var rec = new rect(pos,size)
				  rec.draw("#dadada")
				}
				if (this.roomData[2][exit] == 4) {
				  var pos = new vector2(this.base.position.x - camOffset.x,this.base.position.y+roomSize.x/2-roomSize.y/20 - camOffset.y)
				  var size = new vector2(roomSize.x/10,roomSize.y/10)
				  var rec = new rect(pos,size)
				  rec.draw("#dadada")
				}
			}
		} 

		//not entered
		if (!this.entered) {
			rec2.draw("#0d0d0d")
		}
		
		//next room
		if (this.next) {
			rec2.draw("#1a1a1a")
			for (let exit in this.roomData[2]) {
				if (this.roomData[2][exit] == 1) {
				  var pos = new vector2(this.base.position.x+roomSize.x/2-roomSize.x/20 - camOffset.x,this.base.position.y - camOffset.y)
				  var size = new vector2(roomSize.x/10,roomSize.y/10)
				  var rec = new rect(pos,size)
				  if (enemys.length == 0) {
					  rec.draw("#1a1a1a")
				  }
				}
				if (this.roomData[2][exit] == 2) {
				  var pos = new vector2(this.base.position.x+roomSize.x-roomSize.x/20 - camOffset.x,this.base.position.y+roomSize.x/2-roomSize.y/20 - camOffset.y)
				  var size = new vector2(roomSize.x/10,roomSize.y/10)
				  var rec = new rect(pos,size)
				  if (enemys.length == 0) {
					  rec.draw("#1a1a1a")
				  }
				}
				if (this.roomData[2][exit] == 3) {
				  var pos = new vector2(this.base.position.x+roomSize.x/2-roomSize.x/20 - camOffset.x,this.base.position.y+roomSize.y-roomSize.y/20 - camOffset.y)
				  var size = new vector2(roomSize.x/10,roomSize.y/10)
				  var rec = new rect(pos,size)
				  if (enemys.length == 0) {
					  rec.draw("#1a1a1a")
				  }
				}
				if (this.roomData[2][exit] == 4) {
				  var pos = new vector2(this.base.position.x - camOffset.x,this.base.position.y+roomSize.x/2-roomSize.y/20 - camOffset.y)
				  var size = new vector2(roomSize.x/10,roomSize.y/10)
				  var rec = new rect(pos,size)
				  if (enemys.length == 0) {
					  rec.draw("#1a1a1a")
				  }
				}
			}
		} 

		//decorations
		if (this.roomData[1].length == 0 && this.entered) {
			var scale = new vector2(roomSize.x/2.5,roomSize.x/2.5)
		  	context.drawImage(base_image, 
		  		canvas.width / 2 - roomSize.x/2 + this.base.position.x - camOffset.x + roomSize.x/2 - scale.x/2,
		  		canvas.height / 2 - roomSize.y/2 + this.base.position.y - camOffset.y + roomSize.y/2 - scale.y/2,scale.x,scale.y);
		}

		if (this.roomData[1].length != 0 && this.roomData[2].length != 0 && this.entered) {
			for (let v in this.roomData[0]) {

			  context.drawImage(this.roomData[0][v].img, 
			  		this.base.position.x + this.base.size.x * 0 + canvas.width / 2 - roomSize.x/2 - camOffset.x - (this.roomData[0][v].size.x * (roomSize.x * 0.8)) / 2 + this.roomData[0][v].position.x * (roomSize.x * 0.9),
			  		this.base.position.y + this.base.size.y * 0 + canvas.height / 2 - roomSize.y/2 - camOffset.y - (this.roomData[0][v].size.y * (roomSize.y* 0.8)) / 2 + this.roomData[0][v].position.y * (roomSize.y * 0.9),
			  		this.roomData[0][v].size.x*(roomSize.x*0.8),this.roomData[0][v].size.y*(roomSize.y*0.8));
			}
		}
	}
}

class Player {
	constructor() {
		this.position = new vector2();
		this.position.one()
		this.position.multiply(10)
		this.angle = Math.PI;
		this.strafe = 0;
		this.move = 0;
		this.speed = roomSize.x/8;
		this.vx = 0
		this.vy = 0
		this.maxHealth = 100
		this.health = this.maxHealth
	}
}

class Grid {
	constructor(size,defult = "akakaka") {
		if (defult == "akakaka") {
			console.warn("no defult value set")
		} else {
			this.defult = defult
			this.size = size
			this.map = []
			for (let y = 0; y<=size.y-1; y++) {
				this.map[y] = []
				for (let v = 0; v<=size.x-1; v++) {
					this.map[y][v] = defult
				}
			}
		}
	}

	count(value) {
		var a = 0;
		for (let y = 0; y<=this.size.y-1; y++) {
			for (let x = 0; x<=this.size.x-1; x++) {
				if (this.get(x,y) == value) {
					a++;
				}
			}
		}
		return a
	}

	get(x,y) {
		return this.map[y][x]
	}
	getV2(position) {
		return this.map[position.y][position.x]
	}

	set(x,y,val) {
		this.map[y][x] = val
	}
	setV2(position,val) {
		this.map[position.y][position.x] = val
	}
}

class bullet {
	constructor (direction,type) {
		this.position = new vector2(player.position.x,player.position.y)
		this.direction = direction
		this.type = type
		this.speed = roomSize.x/20
	}

	draw(pos) {
		if (this.direction == 1) {
			this.position.y -= this.speed
		} if (this.direction == 2) {
			this.position.x += this.speed
		} if (this.direction == 3) {
			this.position.y += this.speed
		} if (this.direction == 4) {
			this.position.x -= this.speed
		}

		var data = context.getImageData(this.position.x+canvas.width / 2 - roomSize.x/2 - camOffset.x, this.position.y+canvas.height / 2 - roomSize.y/2 - camOffset.y , 1, 1).data;
		if (data[0] != 0 || data[1] != 0 || data[2] != 0){
			context.fillStyle = 'Green';
			context.beginPath();
	    context.arc(this.position.x+canvas.width / 2 - roomSize.x/2 - camOffset.x, this.position.y+canvas.height / 2 - roomSize.y/2 - camOffset.y , roomSize.x/80, 0, DOUBLE_PI);
	    context.fill();
		} else {
			bullets.splice(pos,1)
			return
		}

		if (this.type == "enemy" && ((this.position.x-player.position.x)**2+(this.position.y-player.position.y)**2)**0.5 <= roomSize.x/10) {
			curShake = 1
			player.health -= 5
			bullets.splice(pos,1)
		}

		if (this.type == "player") {
			for (let v in enemys) {
				if (((this.position.x-enemys[v].position.x)**2+(this.position.y-enemys[v].position.y)**2)**0.5 <= roomSize.x/10) {
					console.log("hit")
					enemys.splice(v,1)
					bullets.splice(pos,1)
				}
			}
		}

		
	}
}

class deco {
	constructor(img = -1,position,size) {
		this.position = position
		this.img = img
		this.size = size
		if (img == -1) {this.img = decorationImages[randInt(0,decorationImages.length-1)]} else {

		}
	}
}

// varibles
var oldCycleTime = 0;
var cycleCount = 0;
var fps_rate = '...';
var mouse =  new vector2();
var mapSize = new vector2(10,10);
var map = new Grid(mapSize,0)
var roomSize = new vector2(WIDTH,HEIGHT);
var player = new Player()
var floor = 1
var roomsAmt = floor*3
var holes = range(mapSize.x * mapSize.y - roomsAmt - 3 ,mapSize.x * mapSize.y - roomsAmt );
var atempts = 0
var nextRoom = null
var lastRoom = null
var stop = 0
var endRoom = 0
var def = true
var camOffset = new vector2()
var zoom = 0
var bullets = []
var keys = []
var shootCount = 0
var shootLimit = 60
var db = false
var shake = 0
var curShake = 0
var enemys = []
var mapOffset = new vector2()
var MaxDash = roomSize.x/10
var look = 0
var plrX = 0
var plrY = 0
var menu = true

// events
{
	document.addEventListener("click", (event) => {
	  if (menu) {
			if (canvas.height/2-30<event.y && event.y<canvas.height/2+30 && canvas.width/2-100<event.x && event.x<canvas.width/2+100) {	
				menu = !menu
			}
		} else {
      var di = 9999999999
			var a = 0
			for (let v of range(1,4)) {
		    let o = new vector2()
		    
		    if (v==1){
		        o.y -= 5
		    }if (v==2){
		       o.x += 5
		    }if (v==3){
		        o.y += 5
		    }if (v==4){
		        o.x -= 5
		    }
		    
		    if (distance(new vector2(player.position.x+mapOffset.x+o.x,player.position.y+mapOffset.y+o.y),mouse) <= di) {
		        di = distance(new vector2(player.position.x+mapOffset.x+o.x,player.position.y+mapOffset.y+o.y),mouse)
		        a = v
		    }
			}
			if (!db) {db = true; bullets.push(new bullet(a,"player")); curShake += 1} 
		}
	});

	document.addEventListener("mousemove", (event) => {
		mouse.x = event.x
		mouse.y = event.y
		def = true
	});

	window.addEventListener("keydown",
    function(e){
      keys[e.keyCode] = true;
			if (e.keyCode == 27) {
				menu = !menu
			}
    },
  false);

	window.addEventListener('keyup',
	    function(e){
	        keys[e.keyCode] = false;
	        if (e.keyCode == 69 && !menu) {
				look = Math.atan2(mouse.x-(player.position.x+mapOffset.x),mouse.y-(player.position.y+mapOffset.y))
				for (let i = 1; i <= MaxDash; i++) {
					var rayX = Math.sin(look)*i+player.position.x+mapOffset.x
					var rayY = Math.cos(look)*i+player.position.y+mapOffset.y
					var data = context.getImageData(rayX,rayY, 1, 1).data;
					if (data[0] == 0 && data[1] == 0 && data[2] == 0){
						player.position.x += Math.sin(look)*(i-1)
						player.position.y += Math.cos(look)*(i-1)
						break
					} else {
						if (i==MaxDash) {
							player.position.x += Math.sin(look)*(MaxDash)
							player.position.y += Math.cos(look)*(MaxDash)
						}
					}
				}
			}
	    },
	false);
}

// functions
function enemyType(flor) {
	if (flor <= 10) {
		if (Math.floor(1.5848931924611136**flor) == randInt(Math.floor(1.5848931924611136**flor),100)) {
			return 2
		} else {
			return 1
		}
	} else if (flor <= 20) {
		if (Math.floor(1.5848931924611136**(flor-10)) == randInt(Math.floor(1.5848931924611136**(flor-10)),100)) {
			return 3
		} else {
			return 2
		}
	}else if (flor <= 25) {
		if (Math.floor(2.51188643150958**(flor-20)) == randInt(Math.floor(2.51188643150958**(flor-20)),100)) {
			return 4
		} else {
			return 3
		}
	}  
}

function distance(pos1,pos2) {
	return Math.sqrt((pos1.x-pos2.x)**2+(pos1.y-pos2.y)**2)
}

function enterRoom(room) {
	if (room.roomData[1].length+room.roomData[2].length >= 2) {
		let dif = enemyType(floor)
		if (dif == 1) {
			for (let v = 1; v <= floor;) {
				v+=1
				var a = randInt(1,3)
				if (a == 1) {
					enemys.push(new ghost())
				}if (a == 2) {
					enemys.push(new shooter())
				}if (a == 3) {
					enemys.push(new runner())
				}
			}
		} if (dif == 2) {
			for (let v = 1; v <= floor;) {
				v+=10
				var a = randInt(1,1)
				if (a == 1) {
					enemys.push(new sheilder())
				}
			}
		}
	}
}

function lerpV2(val1,val2,amt) {

	return new vector2((1 - amt) * val1.x + amt * val2.x,(1 - amt) * val1.y + amt * val2.y)
}

function lerp(val1,val2,amt) {
	let final = (1 - amt) * val1 + amt * val2
	return final
}

function range(start, end) {
    var ans = [];
    for (let i = start; i <= end; i++) {
        ans.push(i);
    }
    return ans;
}

function randInt(min,max) {

	if (min == max) {
		return min
	}
	return Math.floor(min+0.5) + Math.floor(Math.random() * (Math.floor(max+0.5)+1-Math.floor(min+0.5)));
}

function makeRoom(name, position, exitDoors = [1,2], entrenceDoors = [3,4]) {
	let Rect = new rect(new vector2(roomSize.x*position.x,roomSize.y*position.y),new vector2(roomSize.x,roomSize.y))
	let decorations = []
	for (let V = 0; V <= randInt(0,3); V++) {
		let size = new vector2(randInt(20,40)/100,randInt(20,40)/100)
		let pos = new vector2(randInt(10,90)/100,randInt(10,90)/100)
		decorations.push(new deco(-1,pos,size))
	}
	let roomData = [decorations, exitDoors, entrenceDoors]
	return new room(name, Rect, roomData)	
};

function makeMap() {
	for (let y in map.map){
		for (let x in map.map[y]) {
			if (map.get(x,y) != 0) {
				map.set(x,y,0)
			}
		}
	}

	lastRoom = null
	var lastDoor = 0

	var t = 100
	var g = 0
	while (g<=t) {
		if (lastRoom == null) {
			// var position = new vector2(randInt(0,mapSize.x-1),randInt(0,mapSize.y-1));
			var position = new vector2(0,0);
			if (endRoom != 0) {
				position = new vector2(Math.floor(endRoom.base.position.x/roomSize.x) ,Math.floor(endRoom.base.position.y/roomSize.y))
			}
			var exitDoors = [];
			var entrenceDoors = [];

			var check = 0;
			var posible = range(1,4)
			for (let v = 1; v<= 4; v++) {
				var c = randInt(0,posible.length-1)
				var d = posible[c]
				posible.splice(c,1);

				if (d == 1 && position.y != 0 && map.get(position.x,position.y-1) == 0) {
					exitDoors.push(d)
					check++
					break;
				} if (d == 3 && position.y != mapSize.y-1 && map.get(position.x,position.y+1) == 0) {
					exitDoors.push(d)
					check++
					break;
				}if (d == 4 && position.x != 0 && map.get(position.x-1,position.y) == 0) {
					exitDoors.push(d)
					check++
					break;
				} if (d == 2 && position.x != mapSize.x-1 && map.get(position.x+1,position.y) == 0) {
					exitDoors.push(d)
					check++
					break;
				}
			}

			// console.log(exitDoors)
			
			lastDoor = exitDoors[0]
			var r = makeRoom("1",position,exitDoors,entrenceDoors)
			r.entered = true
			map.set(position.x,position.y,r)
			lastRoom = r;
			player.position = new vector2(position.x * roomSize.x + roomSize.x/2 , position.y * roomSize.y + roomSize.y/2)
		} else {
			var exitDoors = [];
			var entrenceDoors = []
			var a = 0
			if (lastDoor <= 2) {
				a = lastDoor + 2
			} else {
				a = lastDoor - 2
			}

			entrenceDoors.push(a)
			var x = lastRoom.base.position.x/roomSize.x;
			var y = lastRoom.base.position.y/roomSize.y;

			if (a == 1) {
				y++
			}if (a == 2) {
				x--
			}if (a == 3) {
				y--
			}if (a == 4) {
				x++
			}

			var check = 0
			var posible = range(1,4)
			for (let v = 1; v<= 4; v++) {
				var c = randInt(0,posible.length-1)
				var d = posible[c]
				posible.splice(c,1);

				if (d == 1 && y != 0 && map.get(x,y-1) == 0) {
					exitDoors.push(d)
					check++
					break;
				} if (d == 3 && y != mapSize.y-1 && map.get(x,y+1) == 0) {
					exitDoors.push(d)
					check++
					break;
				}if (d == 4 && x != 0 && map.get(x-1,y) == 0) {
					exitDoors.push(d)
					check++
					break;
				} if (d == 2 && x != mapSize.x-1 && map.get(x+1,y) == 0) {
					exitDoors.push(d)
					check++
					break;
				}
			}
			if (stop != 0) {
				stop = 0
				break
			}
			if (check == 0) {
				stop++
			}

			var position = new vector2(x,y);

			var r = makeRoom("2",position,exitDoors,entrenceDoors)
			map.set(position.x,position.y,r)
			lastRoom = r;
			lastDoor = exitDoors[0]
		}
		g++
	}
};

function gen() {
	roomsAmt = floor*3
	holes = range(mapSize.x * mapSize.y - roomsAmt - 10 ,mapSize.x * mapSize.y - roomsAmt );
	makeMap();
	while (true) {
		atempts++
		if (!holes.includes(map.count(0))) {
			makeMap();
		} else {
			console.log("Holes:".concat(map.count(0)))
			console.log("atempts:".concat(atempts))
			break;
		}
	}
	endRoom = lastRoom;
	document.title = "done"
	def = false
	atempts = 0;
}

function gameLoop() {
	// get and display fps
	cycleCount+=180/Math.PI;
	if (cycleCount >= 60) cycleCount = 0;
	var startTime = Date.now();
	var cycleTime = startTime - oldCycleTime;
	oldCycleTime = startTime;
	if (cycleCount % 60 == 0) fps_rate = Math.floor(1000 / cycleTime);
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	if (menu) {
		context.fillStyle = "#3D3D90";
		context.fillRect(0,0,canvas.width,canvas.height)
		
		context.fillStyle = "#1D3F6E";
		context.fillRect(canvas.width/2-100,canvas.height/2-30,200,60)
	} else {
		//health handler
		if (cycleCount == 0 && player.health < player.maxHealth-player.maxHealth/1000) {
			player.health+=player.maxHealth/1000
		} 
		if (player.health <= 0) {
			menu = !menu
			player.health = player.maxHealth
			floor = 1
			enemys = []
			bullets = []
			endRoom = 0
			player.vx = 0
			player.vy = 0 
			gen()
		}

		//change the title
		if (def && document.title != "Personal intrest game") {
			document.title = "Personal intrest game"
		}

		// adjust the window size and camera position
		if (shake > curShake) curShake = lerp(curShake,shake,0.01)
		if (shake < curShake) curShake = lerp(curShake,shake,0.1)
		
		camOffset.x = lerp(camOffset.x,Math.floor(player.position.x / roomSize.x) * roomSize.x,0.1)+randInt(-curShake,curShake)
		camOffset.y = lerp(camOffset.y,Math.floor(player.position.y / roomSize.y) * roomSize.x,0.1)+randInt(-curShake,curShake)
		mapOffset = new vector2(canvas.width / 2 - roomSize.x/2 - camOffset.x ,canvas.height / 2 - roomSize.y/2 - camOffset.y)

		// clearing the screen
		context.fillStyle = "#333333";
		context.fillRect(0,0,canvas.width,canvas.height)

		context.fillStyle = '#000000';
		context.fillRect(mapOffset.x, mapOffset.y, roomSize.x*mapSize.x, roomSize.x*mapSize.y);

		// draw map
		{
			for (let y in map.map){
				for (let x in map.map[y]) {
					var spot = map.get(x,y)
					if (spot != 0) {
						spot.draw()
					} else {
						var rec2 = new rect(new vector2(x * roomSize.x + roomSize.x * roomBoarder - camOffset.x,y * roomSize.y + roomSize.x * roomBoarder - camOffset.y), new vector2(roomSize.x-roomSize.x*(roomBoarder*2),roomSize.y-roomSize.y*(roomBoarder*2)))
						rec2.draw("#050505")
					}
				}
			}
			if (floor == 1) {
				context.drawImage(startInfo,canvas.width / 2 - roomSize.x/2 + roomSize.x * roomBoarder - camOffset.x,canvas.height / 2 - roomSize.y/2 +roomSize.y * roomBoarder - camOffset.y,roomSize.x-roomSize.x*(roomBoarder*2),roomSize.y-roomSize.y*(roomBoarder*2)) 
				var a = map.get(0,0).roomData[1][0]
				if (a == 2 && map.get(1,0).entered == true) {
					context.drawImage(startInfo2,canvas.width / 2 - roomSize.x/2 + roomSize.x * roomBoarder - camOffset.x + roomSize.x,canvas.height / 2 - roomSize.y/2 +roomSize.y * roomBoarder - camOffset.y             ,roomSize.x-roomSize.x*(roomBoarder*2),roomSize.y-roomSize.y*(roomBoarder*2))
				}if (a == 3 && map.get(0,1).entered == true) {
					context.drawImage(startInfo2,canvas.width / 2 - roomSize.x/2 + roomSize.x * roomBoarder - camOffset.x             ,canvas.height / 2 - roomSize.y/2 +roomSize.y * roomBoarder - camOffset.y + roomSize.y,roomSize.x-roomSize.x*(roomBoarder*2),roomSize.y-roomSize.y*(roomBoarder*2))
				}
			}
		}
		
		// player movement
		{
			shootCount++
			if (shootCount > shootLimit) shootCount = 0
			if (shootCount % shootLimit == 0) db = false
			
			player.move = 0
			player.strafe = 0

			if (keys[87]) player.move += 1
			if (keys[83]) player.move -= 1
			if (keys[68]) player.strafe += 1
			if (keys[65]) player.strafe -= 1

			if (keys[38] && !db) {db = true; bullets.push(new bullet(1,"player")); curShake += 1}
			if (keys[39] && !db) {db = true; bullets.push(new bullet(2,"player")); curShake += 1}
			if (keys[40] && !db) {db = true; bullets.push(new bullet(3,"player")); curShake += 1}
			if (keys[37] && !db) {db = true; bullets.push(new bullet(4,"player")); curShake += 1}

			if (keys[32]) if (map.get(Math.floor(player.position.x / roomSize.x),Math.floor(player.position.y / roomSize.y)).roomData[1].length == 0) {
				floor++; 
				zoom =0; 
				enemys = []
				bullets = []
				gen();
				curShake = 50;
			}

			if (keys[69]) {
				look = Math.atan2(mouse.x-(player.position.x+mapOffset.x),mouse.y-(player.position.y+mapOffset.y))
				for (let i = 1; i <= MaxDash; i++) {
					var rayX = Math.sin(look)*i+player.position.x+mapOffset.x
					var rayY = Math.cos(look)*i+player.position.y+mapOffset.y
					var data = context.getImageData(rayX,rayY, 1, 1).data;
					if (data[0] == 0 && data[1] == 0 && data[2] == 0){
						context.fillStyle = 'Green';
						context.beginPath();
						context.arc(player.position.x+mapOffset.x + Math.sin(look)*(i-1),player.position.y+mapOffset.y + Math.cos(look)*(i-1), roomSize.x/100, 0, DOUBLE_PI);
						context.fill()
						break
					} else {
						if (i==MaxDash) {
							context.fillStyle = 'Green';
							context.beginPath();
							context.arc(player.position.x+mapOffset.x + Math.sin(look)*(MaxDash),player.position.y+mapOffset.y + Math.cos(look)*(MaxDash), roomSize.x/100, 0, DOUBLE_PI);
							context.fill()
						}
					}
				}
			}

			player.vx = lerp(player.vx,0,0.05)
			player.vy = lerp(player.vy,0,0.05)

			player.position.x += player.vx
			var data = context.getImageData(player.position.x+mapOffset.x, player.position.y+mapOffset.y, 1, 1).data;
			if (data[0] == 0 && data[1] == 0 && data[2] == 0){
				player.position.x -= player.vx
			}

			player.position.y += player.vy
			var data = context.getImageData(player.position.x+mapOffset.x, player.position.y+mapOffset.y, 1, 1).data;
			if (data[0] == 0 && data[1] == 0 && data[2] == 0){
				player.position.y -= player.vy
			}

			if (player.move != 0){
				player.position.y -= player.move / 16 * player.speed

				var data = context.getImageData(player.position.x+mapOffset.x, player.position.y+mapOffset.y, 1, 1).data;
				if (data[0] == 0 && data[1] == 0 && data[2] == 0){
					player.position.y += player.move / 16 * player.speed
				}

			} if (player.strafe != 0) {
				player.position.x += player.strafe / 16 * player.speed

				var data = context.getImageData(player.position.x+mapOffset.x, player.position.y+mapOffset.y, 1, 1).data;
				if (data[0] == 0 && data[1] == 0 && data[2] == 0){
					player.position.x -= player.strafe / 16 * player.speed
				}
			};
		};
		
		// draw player
		{
			context.fillStyle = "#"+Math.floor(lerp(255,16,player.health/player.maxHealth)).toString(16)+Math.floor(lerp(16,255,player.health/player.maxHealth)).toString(16)+"00";
			context.beginPath();
			context.arc(player.position.x+mapOffset.x, player.position.y+mapOffset.y, roomSize.x/20, 0, DOUBLE_PI);
			context.fill();
	 	}
		
		// room updates
		{
			plrX = Math.floor(player.position.x / roomSize.x)
			plrY = Math.floor(player.position.y / roomSize.y)
			if (nextRoom) nextRoom.next = false
			if (map.get(plrX,plrY) != 0) {
				if (map.get(plrX,plrY).entered == false) {
					map.get(plrX,plrY).entered = true
					enterRoom(map.get(plrX,plrY))
				}
				var a = map.get(plrX,plrY).roomData[1][0]
				if (a == 1 && map.get(plrX,plrY-1).entered == false) {
					map.get(plrX,plrY-1).next = true
					nextRoom = map.get(plrX,plrY-1)
				}if (a == 2 && map.get(plrX+1,plrY).entered == false) {
					map.get(plrX+1,plrY).next = true
					nextRoom = map.get(plrX+1,plrY)
				}if (a == 3 && map.get(plrX,plrY+1).entered == false) {
					map.get(plrX,plrY+1).next = true
					nextRoom = map.get(plrX,plrY+1)
				}if (a == 4 && map.get(plrX-1,plrY).entered == false) {
					map.get(plrX-1,plrY).next = true
					nextRoom = map.get(plrX-1,plrY)
				}
			}	
		}

		for (let v in enemys) {
			enemys[v].update()
		}

		for (let v in bullets) {
			bullets[v].draw(v)
		}

		zoom = lerp(zoom,roomSize.x*2.5,0.04)
		context.fillStyle = "#0d0d0d";
		context.beginPath();
		context.arc(player.position.x+mapOffset.x, player.position.y+mapOffset.y, zoom, 0, 2 * Math.PI);
		context.rect(canvas.width, 0,-canvas.width,canvas.height);
		context.fill();
	}

	setTimeout(gameLoop, cycleDelay);
	
	context.fillStyle = '#ffffff';
	context.font = '50px Monospace';
	context.fillText('FPS: ' + fps_rate, 0, 50);
	context.fillText("Ver:"+9, 0, 100);
}
window.onload = function() {
	gen(); 
	gameLoop()
	console.log("loaded"); 
}
