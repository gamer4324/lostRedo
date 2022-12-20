// constances
console.log("Ver:"+45)
const canvas = document.getElementById('screen');
const context = canvas.getContext('2d',{
  willReadFrequently: true,
});
const WIDTH = 400;
const HEIGHT = 400;
const DOUBLE_PI = 2 * Math.PI;
const HALF_PI = Math.PI/2;
const roomBoarder = 0.05;
// images
var base_image = new Image();
base_image.src = "assests/images/exit.png";

var startInfo = new Image()
startInfo.src = "assests/images/start.png";
var startInfo2 = new Image()
startInfo2.src = "assests/images/start2.png";

var imgages = 3
var decorationImages = []
for (let img = 1; img <= imgages; img++) {
	var curImage = new Image();
	curImage.src = "assests/decorations/"+img+".png";
	decorationImages.push(curImage)
}

//classes
class puddle {
	constructor(pos) {
		this.position = pos
		this.rad = size/40
		this.frame = 1
		this.color = "#" + Math.floor(Math.random()*16777215).toString(16)
		this.color = "#8a0303"
		this.fade = false
		this.fadeStart = 0
	}
	update(pos) {
		this.frame++
		let size = this.rad-(this.frame/50)**2

		if (this.fade && 1-((this.frame-this.fadeStart)/25) > 0) {
			context.globalAlpha = 1-((this.frame-this.fadeStart)/25)
			size = this.rad-(this.fadeStart/50)**2
		} if (this.fade && 1-((this.frame-this.fadeStart)/25) <= 0) {
			puddles.splice(pos,1)
			return false
		}

		if (this.rad-(this.frame/50)**2 <= size/10/8 && !this.fade) {
			this.fade = true
			this.fadeStart = this.frame
			size = this.rad-(this.fadeStart/50)**2
		}

		if (this.frame/25>=1 && !this.fade) {
			context.globalAlpha = 1
		} else if(!this.fade) {
			context.globalAlpha = this.frame/25
		}

		context.fillStyle = this.color
		context.beginPath();
		context.arc(this.position.x+canvas.width / 2 - size/2 - camOffset.x, this.position.y+canvas.height / 2 - size/2 - camOffset.y , 
			Math.abs(size),
			0, DOUBLE_PI);
	  context.fill();
	  context.globalAlpha = 1
	}
}

class runner {
	constructor () {
		this.speed = size/16*0.7*(randInt(800,1200)/1000)
		this.position = new vector2(Math.floor(player.position.x / size)*size+randInt(size*0.1,size*0.9),Math.floor(player.position.y / size)*size+randInt(size*0.1,size*0.9))
		this.img = new Image();
		this.img.src = "assests/enemys/runner.png";
		this.size = new vector2(size/15,size/15)
		this.teir = 1
	}

	update() {
		if (((this.position.x-player.position.x)**2+(this.position.y-player.position.y)**2)**0.5 >= (this.size.y+this.size.x)/2) {
			this.position.x -= Math.sin(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed
			this.position.y -= Math.cos(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed
		} else {
			player.vx -= Math.sin(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed/4
			player.vy -= Math.cos(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed/4
			player.health -= 2
			shake+=1
		}
	}

	render() {
		context.drawImage(this.img,this.position.x - this.size.x / 2 - offset.x,this.position.y - this.size.y/2 - offset.y,this.size.x,this.size.y)
	}

	hit(pos,v) {
		puddles.push(new puddle({x:this.position.x,y:this.position.y}))
		for (let v = 0; v < 3; v++) {
			let xo = randInt(-size/10/8,size/10/8)
			let yo = randInt(-size/10/8,size/10/8)
			let pud = new puddle({x:this.position.x+xo,y:this.position.y+yo})
			puddles.push(pud)
		}
		player.curency += this.teir**2
		enemys.splice(v,1)
		bullets.splice(pos,1)
	}
}

class ghost {
	constructor () {
		this.speed = size/16*0.7*(randInt(800,1200)/1000)
		this.position = new vector2(Math.floor(player.position.x / size)*size+randInt(size*0.1,size*0.9),Math.floor(player.position.y / size)*size+randInt(size*0.1,size*0.9))
		this.img = new Image();
		this.img.src = "assests/enemys/ghost.png";
		this.size = new vector2(size/15,size/15)
		this.teir = 1
	}

	render() {
		context.drawImage(this.img,this.position.x - offset.x - this.size.x / 2,this.position.y - offset.y - this.size.y/2,this.size.x,this.size.y)
	}

	update() {
		if (((this.position.x-mouse.x- offset.x)**2+(this.position.y-mouse.y - offset.y)**2)**0.5 >= (this.size.x)/2) {
			this.position.x -= Math.sin(Math.atan2(this.position.x - mouse.x - offset.x,this.position.y - mouse.y - offset.y))/16*this.speed
			this.position.y -= Math.cos(Math.atan2(this.position.x - mouse.x - offset.x,this.position.y - mouse.y - offset.y))/16*this.speed
		} else {
			player.health -= 1.5
			shake+=1
		}
	}

	hit(pos,v) {
		
		puddles.push(new puddle({x:this.position.x,y:this.position.y}))
		for (let v = 0; v < 3; v++) {
			let xo = randInt(-size/10/8,size/10/8)
			let yo = randInt(-size/10/8,size/10/8)
			let pud = new puddle({x:this.position.x+xo,y:this.position.y+yo})
			puddles.push(pud)
		}
		player.curency += this.teir**2
		enemys.splice(v,1)
		bullets.splice(pos,1)
	}
}

class phantom {
	constructor () {
		this.speed = size/16*0.7*(randInt(800,1200)/1000)
		this.position = new vector2(Math.floor(player.position.x / size)*size+randInt(size*0.1,size*0.9),Math.floor(player.position.y / size)*size+randInt(size*0.1,size*0.9))
		this.img = new Image();
		this.img.src = "assests/enemys/phantom.png";
		this.size = new vector2(size/15,size/15)
		this.teir = 2
		this.vx = 0
		this.vy = 0
		this.drag = randInt(10,100)/1000
	}

	render() {
		context.drawImage(this.img,this.position.x -offset.x - this.size.x / 2,this.position.y -offset.y - this.size.y/2,this.size.x,this.size.y)
	}

	update() {

		this.vx = lerp(this.vx,0,this.drag)
		this.vy = lerp(this.vy,0,this.drag)

		this.position.x += this.vx
		this.position.y += this.vy


		if (((this.position.x-mouse.x- offset.x)**2+(this.position.y-mouse.y - offset.y)**2)**0.5 >= (this.size.x)/2) {
			this.vx -= Math.sin(Math.atan2(this.position.x - mouse.x -offset.x,this.position.y - mouse.y -offset.y))/16*this.speed
			this.vy -= Math.cos(Math.atan2(this.position.x - mouse.x -offset.x,this.position.y - mouse.y -offset.y))/16*this.speed
		} else {
			shake = 1
			player.health -= 2.5
		}
	}

	hit(pos,v) {
		puddles.push(new puddle({x:this.position.x,y:this.position.y}))
		for (let v = 0; v < 3; v++) {
			let xo = randInt(-size/10/8,size/10/8)
			let yo = randInt(-size/10/8,size/10/8)
			let pud = new puddle({x:this.position.x+xo,y:this.position.y+yo})
			puddles.push(pud)
		}
		player.curency += this.teir**2
		enemys.splice(v,1)
		bullets.splice(pos,1)
	}
}

class shooter {
	constructor () {
		this.speed = size/16*0.7*(randInt(800,1200)/1000)
		this.position = new vector2(Math.floor(player.position.x / size)*size+randInt(size*0.1,size*0.9),Math.floor(player.position.y / size)*size+randInt(size*0.1,size*0.9))
		this.side = randInt(1,4)
		this.img = new Image();
		this.img.src = "assests/enemys/shooter.png";
		this.size = new vector2(size/15,size/15)
		this.canShoot = false
		this.shootLimti = randInt(30,90)
		this.count = randInt(1,Math.floor(this.shootLimti/2))
		this.teir = 1
	}

	render() {
		context.drawImage(this.img,this.position.x - offset.x - this.size.x / 2,this.position.y - offset.y - this.size.y/2,this.size.x,this.size.y)
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
			this.position.y = Math.floor(player.position.y / size) * size + size*0.9
		}if (this.side == 2){
			this.position.x = Math.floor(player.position.x / size) * size + size*0.1
		}if (this.side == 3){
			this.position.y = Math.floor(player.position.y / size) * size + size*0.1
		}if (this.side == 4){
			this.position.x = Math.floor(player.position.x / size) * size + size*0.9
		}

		if (this.canShoot) {
			this.canShoot = !this.canShoot

			var a = bullets.push(new bullet(this.side,"enemy"))
			bullets[a-1].position.x = this.position.x
			bullets[a-1].position.y = this.position.y
		}
	}

	hit(pos,v) {
		puddles.push(new puddle({x:this.position.x,y:this.position.y}))
		for (let v = 0; v < 3; v++) {
			let xo = randInt(-size/10/8,size/10/8)
			let yo = randInt(-size/10/8,size/10/8)
			let pud = new puddle({x:this.position.x+xo,y:this.position.y+yo})
			puddles.push(pud)
		}
		player.curency += this.teir**2
		enemys.splice(v,1)
		bullets.splice(pos,1)
	}
}

class blocker {
	constructor () {
		this.speed = size/16*0.7*(randInt(800,1200)/1000)
		this.position = new vector2(Math.floor(player.position.x / size)*size+randInt(size*0.1,size*0.9),Math.floor(player.position.y / size)*size+randInt(size*0.1,size*0.9))
		this.img = new Image();
		this.img.src = "assests/enemys/blocker.png";
		this.size = new vector2(size/15,size/15)
		this.countLimti = randInt(50,250)
		this.count = randInt(1,Math.floor(this.countLimti/2))
		this.sheild = false
		this.anggle = 0
		this.teir = 2
	}
	
	render() {
		if (this.sheild == true) { 
			context.beginPath();
	    context.strokeStyle = "#0000000";
	    context.arc((this.position.x-offset.x),(this.position.y-offset.y),size/20*2,-this.anggle-Math.PI/4,-this.anggle+Math.PI/4);
	    context.lineWidth = size/10
			context.stroke();
		}
		context.drawImage(this.img,this.position.x - offset.x - this.size.x / 2,this.position.y - offset.y - this.size.y/2,this.size.x,this.size.y)
	}

	update() {
		this.count++;
		if (this.count >= this.countLimti) this.count = 0;
		if (this.count % this.countLimti == 0) {
			this.sheild = !this.sheild
			this.anggle = Math.atan2(player.position.x-this.position.x,player.position.y-this.position.y)-Math.PI/2
			if (this.sheild == true) {
				this.speed /= 2
			} else {
				this.speed *= 2
			}
		}
		

		//move and draw
		if (((this.position.x-player.position.x)**2+(this.position.y-player.position.y)**2)**0.5 >= (this.size.y+this.size.x)/2) {
			this.position.x -= Math.sin(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed
			this.position.y -= Math.cos(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed
		} else {
			player.vx -= Math.sin(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed/4
			player.vy -= Math.cos(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed/4
			shake += 1
			player.health -= 5
		}
	}

	hit(pos,v) {
		puddles.push(new puddle({x:this.position.x,y:this.position.y}))
		for (let v = 0; v < 3; v++) {
			let xo = randInt(-size/10/8,size/10/8)
			let yo = randInt(-size/10/8,size/10/8)
			let pud = new puddle({x:this.position.x+xo,y:this.position.y+yo})
			puddles.push(pud)
		}
		player.curency += this.teir**2
		enemys.splice(v,1)
		bullets.splice(pos,1)
	}
}

class controller {
	constructor () {
		this.speed = size/8*0.7*(randInt(800,1200)/1000)*2
		this.position = new vector2(Math.floor(player.position.x / size)*size+randInt(size*0.1,size*0.9),Math.floor(player.position.y / size)*size+randInt(size*0.1,size*0.9))
		this.img = new Image();
		this.img.src = "assests/enemys/controller.png";
		this.size = new vector2(size/15,size/15)
		this.countLimti = randInt(60,180)
		this.count = randInt(1,Math.floor(this.countLimti/2))
		this.state = false
		this.teir = 3
	}
	
	render() {
		context.drawImage(this.img,this.position.x -offset.x - this.size.x / 2,this.position.y -offset.y - this.size.y/2,this.size.x,this.size.y)
	}

	update() {
		this.count++;
		if (this.count >= this.countLimti) this.count = 0;
		if (this.count % this.countLimti == 0) {
			this.state = !this.state
			if (this.state == true) {
				player.speed /= 2
				this.speed /= 2
			} else {
				player.speed *= 2
				this.speed *= 2
			}
		}

		//move and draw
		if (((this.position.x-player.position.x)**2+(this.position.y-player.position.y)**2)**0.5 >= (this.size.y+this.size.x)/2) {
			this.position.x -= Math.sin(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed
			this.position.y -= Math.cos(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed
		} else {
			player.health -= 50
		}
	}

	hit(pos,v) {
		puddles.push(new puddle({x:this.position.x,y:this.position.y}))
		for (let v = 0; v < 3; v++) {
			let xo = randInt(-size/10/8,size/10/8)
			let yo = randInt(-size/10/8,size/10/8)
			let pud = new puddle({x:this.position.x+xo,y:this.position.y+yo})
			puddles.push(pud)
		}
		if (this.state == true) player.speed *= 2
		player.curency += this.teir**2
		enemys.splice(v,1)
		bullets.splice(pos,1)
	}
}

class doger {
	constructor () {
		this.speed = size/16*0.7*(randInt(800,1200)/1000)*2
		this.position = new vector2(Math.floor(player.position.x / size)*size+randInt(size*0.1,size*0.9),Math.floor(player.position.y / size)*size+randInt(size*0.1,size*0.9))
		this.img = new Image();
		this.img.src = "assests/enemys/doger.png";
		this.size = new vector2(size/15,size/15)
		this.teir = 1
		this.vel = new vector2(0,0)
	}

	render() {
		context.drawImage(this.img,this.position.x - offset.x - this.size.x / 2,this.position.y - offset.y - this.size.y/2,this.size.x,this.size.y)
	}

	update() {
		let positions = [{x:size/2-size*0.05,y:0},{x:size-size*0.05,y:size/2-size*0.05},{x:size/2-size*0.05,y:size-size*0.05},{x:0,y:size/2-size*0.05}]
	  let sizes = [{x:size*0.1,y:size*0.05},{x:size*0.05,y:size*0.1},{x:size*0.1,y:size*0.05},{x:size*0.05,y:size*0.1}]
		this.vel.x = lerp(this.vel.x,0,0.05)
		this.vel.y = lerp(this.vel.y,0,0.05)
	  
		this.position.x += this.vel.x
		let bulRoom = {x:Math.floor(this.position.x/size),y:Math.floor(this.position.y/size)}
		let curCRoom = getRoom(bulRoom)
		if(curCRoom == null){
			this.position.x -= this.vel.x
		} else {
			let main = (this.position.x >= curCRoom.position.x*size+size*0.05 && this.position.x <= curCRoom.position.x*size+size-size*0.05 && this.position.y >= curCRoom.position.y*size+size*0.05 && this.position.y <= curCRoom.position.y*size+size-size*0.05)
			let entr = (curCRoom.entr != -1 && this.position.x <= positions[curCRoom.entr].x+curCRoom.position.x*size+sizes[curCRoom.entr].x  && this.position.x >= positions[curCRoom.entr].x+curCRoom.position.x*size && this.position.y >= positions[curCRoom.entr].y+curCRoom.position.y*size && this.position.y <= positions[curCRoom.entr].y+curCRoom.position.y*size+sizes[curCRoom.entr].y)
			let exit = (curCRoom.exit != -1 && this.position.x <= positions[curCRoom.exit].x+curCRoom.position.x*size+sizes[curCRoom.exit].x  && this.position.x >= positions[curCRoom.exit].x+curCRoom.position.x*size && this.position.y >= positions[curCRoom.exit].y+curCRoom.position.y*size && this.position.y <= positions[curCRoom.exit].y+curCRoom.position.y*size+sizes[curCRoom.exit].y)
			if (enemys.length != 0 && exit == true) {
				entr = false
				main = false
				exit = false
			} 
			if (!(exit || main || entr)) {
				this.position.x -= this.vel.x
			}
		}

		this.position.y += this.vel.y
		bulRoom = {x:Math.floor(this.position.x/size),y:Math.floor(this.position.y/size)}
		curCRoom = getRoom(bulRoom)
		if(curCRoom == null){
			this.position.y -= this.vel.y
		} else {
			let main = (this.position.x >= curCRoom.position.x*size+size*0.05 && this.position.x <= curCRoom.position.x*size+size-size*0.05 && this.position.y >= curCRoom.position.y*size+size*0.05 && this.position.y <= curCRoom.position.y*size+size-size*0.05)
			let entr = (curCRoom.entr != -1 && this.position.x <= positions[curCRoom.entr].x+curCRoom.position.x*size+sizes[curCRoom.entr].x  && this.position.x >= positions[curCRoom.entr].x+curCRoom.position.x*size && this.position.y >= positions[curCRoom.entr].y+curCRoom.position.y*size && this.position.y <= positions[curCRoom.entr].y+curCRoom.position.y*size+sizes[curCRoom.entr].y)
			let exit = (curCRoom.exit != -1 && this.position.x <= positions[curCRoom.exit].x+curCRoom.position.x*size+sizes[curCRoom.exit].x  && this.position.x >= positions[curCRoom.exit].x+curCRoom.position.x*size && this.position.y >= positions[curCRoom.exit].y+curCRoom.position.y*size && this.position.y <= positions[curCRoom.exit].y+curCRoom.position.y*size+sizes[curCRoom.exit].y)
			if (enemys.length != 0 && exit == true) {
				entr = false
				main = false
				exit = false
			} 
			if (!(exit || main || entr)) {
				this.position.y -= this.vel.y
			}
		}

		if (((this.position.x-player.position.x)**2+(this.position.y-player.position.y)**2)**0.5 >= (this.size.y+this.size.x)/2) {
			this.position.x -= Math.sin(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed
			this.position.y -= Math.cos(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed
		} else {
			player.vx -= Math.sin(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed/4
			player.vy -= Math.cos(Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))/16*this.speed/4
			shake += 1
			player.health -= 5
		}		
	}

	hit(pos,v) {
		if (randInt(1,6)==6) {
			puddles.push(new puddle({x:this.position.x,y:this.position.y}))
			for (let vi = 0; vi < 3; vi++) {
				let xo = randInt(-size/10/8,size/10/8)
				let yo = randInt(-size/10/8,size/10/8)
				let pud = new puddle({x:this.position.x+xo,y:this.position.y+yo})
				puddles.push(pud)
			}
			player.curency += enemys[v].teir**2
			enemys.splice(v,1)
			bullets.splice(pos,1)
		} else {
			let flip = [-1,3,4,1,2]
			let a = -1
			let b = -1

			if (bullets[pos]) {
				b = flip[bullets[pos].direction]
				while (true) {
					let rnd = randInt(1,4)
					if (rnd != bullets[pos].direction & rnd != b) {
						a = rnd
						break
					}
				}
				if (a==1) this.vel.y += 10
				if (a==2) this.vel.x -= 10
				if (a==3) this.vel.y -= 10
				if (a==4) this.vel.x += 10
				bullets.splice(pos,1)	
			}
		}
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

class Player {
	constructor() {
		this.position = new vector2(size/2,size/2);
		this.angle = Math.PI;
		this.strafe = 0;
		this.move = 0;
		this.speed = size/8;
		this.vx = 0
		this.vy = 0
		this.maxHealth = 100
		this.health = this.maxHealth
		this.curency = 0
	}
}

class bullet {
	constructor (direction,type) {
		this.position = new vector2(player.position.x,player.position.y)
		this.direction = direction
		this.type = type
		this.speed = size/40
	}

	render() {
		context.fillStyle = 'Green';
		context.beginPath();
    context.arc(this.position.x - offset.x, this.position.y - offset.y , size/80, 0, DOUBLE_PI);
    context.fill();
	}

	update(pos) {
		if (this.direction == 1) {
			this.position.y -= this.speed
		} if (this.direction == 2) {
			this.position.x += this.speed
		} if (this.direction == 3) {
			this.position.y += this.speed
		} if (this.direction == 4) {
			this.position.x -= this.speed
		}

	  let positions = [{x:size/2-size*0.05,y:0},{x:size-size*0.05,y:size/2-size*0.05},{x:size/2-size*0.05,y:size-size*0.05},{x:0,y:size/2-size*0.05}]
	  let sizes = [{x:size*0.1,y:size*0.05},{x:size*0.05,y:size*0.1},{x:size*0.1,y:size*0.05},{x:size*0.05,y:size*0.1}]
	  let bulRoom = {x:Math.floor(this.position.x/size),y:Math.floor(this.position.y/size)}
		let curCRoom = getRoom(bulRoom)
		if(curCRoom == null){
			bullets.splice(pos,1)
			return
		}
		let main = (this.position.x >= curCRoom.position.x*size+size*0.05 && this.position.x <= curCRoom.position.x*size+size-size*0.05 && this.position.y >= curCRoom.position.y*size+size*0.05 && this.position.y <= curCRoom.position.y*size+size-size*0.05)
		let entr = (curCRoom.entr != -1 && this.position.x <= positions[curCRoom.entr].x+curCRoom.position.x*size+sizes[curCRoom.entr].x  && this.position.x >= positions[curCRoom.entr].x+curCRoom.position.x*size && this.position.y >= positions[curCRoom.entr].y+curCRoom.position.y*size && this.position.y <= positions[curCRoom.entr].y+curCRoom.position.y*size+sizes[curCRoom.entr].y)
		let exit = (curCRoom.exit != -1 && this.position.x <= positions[curCRoom.exit].x+curCRoom.position.x*size+sizes[curCRoom.exit].x  && this.position.x >= positions[curCRoom.exit].x+curCRoom.position.x*size && this.position.y >= positions[curCRoom.exit].y+curCRoom.position.y*size && this.position.y <= positions[curCRoom.exit].y+curCRoom.position.y*size+sizes[curCRoom.exit].y)
		if (enemys.length != 0 && exit == true) {
			entr = false
			main = false
			exit = false
		} 
		if (!(exit || main || entr)) {
			bullets.splice(pos,1)
			return
		}

		if (this.type == "enemy" && (Math.sqrt(Math.pow(this.position.x-player.position.x,2)+Math.pow(this.position.y-player.position.y,2)) <= size/30)) {
			shake += 5
			player.health -= 25
			bullets.splice(pos,1)
		}

		if (this.type == "player") {
			for (let v in enemys) {
				if (Math.sqrt(Math.pow(this.position.x-enemys[v].position.x,2)+Math.pow(this.position.y-enemys[v].position.y,2)) <= size/30) {
					enemys[v].hit(pos,v)
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

class room {
  constructor(pos,entr,exit,dirt) {
    this.position = pos
    this.exit = exit
    this.entr = entr
    this.dirt = dirt
  }
}

// varibles
var FPS = 60;
var cycleDelay = Math.floor(1000 / FPS);
var oldCycleTime = 0;
var cycleCount = 0;
var fps_rate = '...';
var mouse =  new vector2();
var floor = 1
var bullets = []
var keys = []
var shootCount = 0
var shootLimit = 61
var db = false
var enemys = []
var menuState = 1
var scrollMenu1 = 0 
var scrollMenu2 = 0 
var shopItems = [
{name:"Max Health",price:2,timesBought:0,max:18},
{name:"Shoot speed",price:10,timesBought:0,max:12},
{name:"Walk speed",price:4,timesBought:0,max:16}
] 
var chances = [100,0,0]
//new vars

var map = [new room({x:0,y:0}, -1, randInt(0,3),"B")]
var mapCount = 1
var camSpeed = 0.1
var size = WIDTH || HEIGHT
var curRoom = {x:0,y:0}
var Boffset = {x:curRoom.x*size-canvas.width/2,y:curRoom.y*size-canvas.height/2}
var offset = {x:curRoom.x*size-canvas.width/2,y:curRoom.y*size-canvas.height/2}
var player = new Player()
var puddles = []
var shake = 0

// events
{
	document.addEventListener("click", (event) => {
	  if (menuState != 0) {
			if (canvas.height/2-30<event.y && event.y<canvas.height/2+30 && canvas.width/2-100<event.x && event.x<canvas.width/2+100) {	
				menuState = 0
			}
			if (menuState == 2) {
				for (let i = 1; i <= shopItems.length; i++) {
			    if (mouse.x - (canvas.width/2-500) < i * (1000/shopItems.length) ) {
			    	if (player.curency >= shopItems[i-1].price*(shopItems[i-1].timesBought+1) && shopItems[i-1].timesBought < shopItems[i-1].max) {
			        player.curency -= shopItems[i-1].price*(shopItems[i-1].timesBought+1)
			        shopItems[i-1].timesBought++
			        if (i == 1) {
			        	player.maxHealth += 12
			        } else if (i == 2) {
			        	shootLimit -= 5
			        } else if (i == 3) {
			        	player.speed += 10
			        }
			    	}
						break
			    }
				} 
			}
		} 
	});

	document.addEventListener("mousemove", (event) => {
		mouse.x = event.x
		mouse.y = event.y
	});

	document.addEventListener('keydown', function(event) {
		keys[event.keyCode] = true;
		if (event.keyCode == 27) {
			if (menuState == 0) {
				menuState = 2
				document.body.exitPointerLock();
			} else {
				menuState = 0
				document.body.requestPointerLock();
			}
		}
	})

	window.addEventListener('keyup',
	function(e){
		keys[e.keyCode] = false;
	},false);
}

// functions
function nextFloor() {
	puddles = []
	player.curency += floor**2
	floor++
	if (floor==3) {
		chances[0]=98
		chances[1]=2
	}if (floor==5) {
		chances[0]=96
		chances[1]=4
	}if (floor==6) {
		chances[0]=92
		chances[1]=8
	}if (floor==8) {
		chances[0]=85
		chances[1]=15
	}if (floor==10) {
		chances[0]=79
		chances[1]=20
		chances[2]=1
	}if (floor==12) {
		chances[0]=54
		chances[1]=45
	}if (floor==14) {
		chances[0]=10
		chances[1]=87
		chances[2]=3
	}if (floor==16) {
		chances[0]=5
		chances[1]=90
		chances[2]=5
	}if (floor==18) {
		chances[1]=85
		chances[2]=10
	}if (floor==19) {
		chances[1]=70
		chances[2]=25
	}if (floor==22) {
		chances[1]=60
		chances[2]=35
	}if (floor==25) {
		chances[1]=5
		chances[2]=90
	}
	sessionStorage.setItem("weights", JSON.stringify(chances));
	enemys = []
	bullets = []
	map = [new room({x:0,y:0}, -1, randInt(0,3),"B")]
	player.position = {x:size/2,y:size/2}
	mapCount = 1
	curRoom = {x:0,y:0}
	offset = {x:curRoom.x*size-canvas.width/2,y:curRoom.y*size-canvas.height/2}
	shake += 50;
}

function weighted_random(items) {
  let i;
  let a = JSON.parse(sessionStorage.getItem("weights"))	
	for (i = 0; i < a.length; i++)
    a[i] += a[i - 1] || 0;
  
  let random = Math.random() * a[a.length - 1];
  
  for (i = 0; i < a.length; i++)
      if (a[i] > random)
          break;
  return items[i];
}

function change_fps(Nfps) {
	FPS = Nfps;
	cycleDelay = Math.floor(1000 / Nfps);
}

function distance(pos1,pos2) {
	return Math.sqrt((pos1.x-pos2.x)**2+(pos1.y-pos2.y)**2)
}

function enterRoom() {
	shake+=10
	for (let vds = 1; vds<=floor; vds++) {
		let chance = weighted_random(["common","rare","epic"],chances)
		console.log(chance)
		if (chance == "common") {
			var a = randInt(1,3)
			if (a == 1) {
				enemys.push(new ghost())
			}if (a == 2) {
				enemys.push(new shooter())
			}if (a == 3) {
				enemys.push(new runner())
			}
		} if (chance == "rare") {
			var a = randInt(1,3)
			if (a == 1) {
				enemys.push(new blocker())
			}if (a == 2) {
				enemys.push(new doger())
			}if (a == 3) {
				enemys.push(new phantom())
			}
		} if (chance == "epic") {
			enemys.push(new controller())
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

function generateRoom(oldRoom) {
  let flipDoors = [2,3,0,1]
  let offsets = [{x:0,y:-1},{x:1,y:0},{x:0,y:1},{x:-1,y:0}]
  let position = {x: oldRoom.position.x + offsets[oldRoom.exit].x, y: oldRoom.position.y + offsets[oldRoom.exit].y}
  let directions = [["B","L","S","R"],["R","B","L","S"],["S","R","B","L"],["L","S","R","B"]]
  let entr = flipDoors[oldRoom.exit]
  let exit = -1

  mapCount++
  if (floor*4 > mapCount) {
	  let posible = [0,1,2,3]
	  for (var i = 0; i < 4; i++) {
	    let randPosition = randInt(0,posible.length-1)
	    let value = posible[randPosition]
	    let LRS = directions[entr][value]
	    posible.splice(randPosition,1)
	    if (value != entr && !(oldRoom.dirt == "L" && LRS == "L") && !(oldRoom.dirt == "R" && LRS == "R")) {
	      exit = value
	      break
	    }
	  }	
  }
  
  let newRoom = new room(position,entr,exit,directions[entr][exit])
  map.push(newRoom)

  if (exit != -1 && entr != -1) enterRoom()

  if (map.length > 4) {
    map.splice(0,1)
    map[0].entr = -1
  }
  return newRoom
}

function getRoom(position) {
	for (var i = map.length - 1; i >= 0; i--) {
		if(map[i].position.x == position.x && map[i].position.y == position.y) {
			return map[i]
		}
	}
	return null
}

function render() {
	//draw map
  let positions = [{x:size/2-size*0.05,y:0},{x:size-size*0.05,y:size/2-size*0.05},{x:size/2-size*0.05,y:size-size*0.05},{x:0,y:size/2-size*0.05}]
  let sizes = [{x:size*0.1,y:size*0.05},{x:size*0.05,y:size*0.1},{x:size*0.1,y:size*0.05},{x:size*0.05,y:size*0.1}]
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
	context.fillStyle = "#333333";
	context.fillRect(0,0,canvas.width,canvas.height)
  for (var i = 0; i < map.length; i++) {

		context.fillStyle = "#2E2E2E"
    context.fillRect(map[i].position.x*size - offset.x ,map[i].position.y*size - offset.y ,size,size)
		
		context.fillStyle = "#605853"
    context.fillRect(map[i].position.x*size+size*0.05 - offset.x ,map[i].position.y*size+size*0.05 - offset.y ,size-size*0.1,size-size*0.1)

    if (map[i].entr != -1) {
    	if (enemys.length == 0 || (map[i].position.x == curRoom.x && map[i].position.y == curRoom.y)) {
	      context.fillStyle = "605853"
	      context.fillRect(positions[map[i].entr].x+map[i].position.x*size - offset.x ,positions[map[i].entr].y+map[i].position.y*size - offset.y ,sizes[map[i].entr].x,sizes[map[i].entr].y)
	    }
    }

    if (map[i].exit != -1) {
    	if (enemys.length == 0) {
		    context.fillStyle = "605853"
		    context.fillRect(positions[map[i].exit].x+map[i].position.x*size - offset.x ,positions[map[i].exit].y+map[i].position.y*size - offset.y ,sizes[map[i].exit].x,sizes[map[i].exit].y)
    	}
    } else {
    	context.drawImage(base_image,map[i].position.x*size - offset.x + size/2 - size*0.2,map[i].position.y*size - offset.y + size / 2 - size*0.2,size*0.4,size*0.4)
    }
  }
  if (floor == 1) {
		context.drawImage(startInfo, size*0.05 - offset.x , size*0.05 - offset.y ,size-size*0.1,size-size*0.1)
		let infoPos = [{x:0,y:-1},{x:1,y:0},{x:0,y:1},{x:-1,y:0}]
		if (getRoom(infoPos[map[0].exit]))	context.drawImage(startInfo2, infoPos[map[0].exit].x * size + size*0.05 - offset.x , infoPos[map[0].exit].y * size + size*0.05 - offset.y ,size-size*0.1,size-size*0.1)
	}

  //draw puddles
  for (var i = 0; i < puddles.length; i++) {
  	puddles[i].frame++
		let size = puddles[i].rad-(puddles[i].frame/50)**2

		if (puddles[i].fade) {
			if (1-(puddles[i].frame-puddles[i].fadeStart)/25 != Math.abs(1-(puddles[i].frame-puddles[i].fadeStart)/25)) {
				puddles.splice(i,1)
				continue
			}
			size = puddles[i].rad-(puddles[i].fadeStart/50)**2
			context.globalAlpha = 1-(puddles[i].frame-puddles[i].fadeStart)/25
		}


		if (puddles[i].rad-(puddles[i].frame/50)**2 <= puddles[i].rad/2 && !puddles[i].fade) {
			puddles[i].fade = true
			puddles[i].fadeStart = puddles[i].frame
		}

		//fade in
		if (puddles[i].frame/25>=1 && !puddles[i].fade) {
			context.globalAlpha = 1
		} else if(!puddles[i].fade) {
			context.globalAlpha = puddles[i].frame/25
		}

		//draw
		context.fillStyle = puddles[i].color
		context.beginPath();
		context.arc(puddles[i].position.x - size/2 - offset.x, puddles[i].position.y - size/2 - offset.y , 
			Math.abs(size),
			0, DOUBLE_PI);
	  context.fill();
	  context.globalAlpha = 1
  }

  //draw bullets
  for (var i = 0; i < bullets.length; i++) {
  	bullets[i].render()
  }

	//draw player
	{
		context.fillStyle = "#"+Math.floor(lerp(255,16,player.health/player.maxHealth)).toString(16)+Math.floor(lerp(16,255,player.health/player.maxHealth)).toString(16)+"00";
		context.beginPath();
		context.arc(player.position.x-offset.x, player.position.y-offset.y, size/40, 0, DOUBLE_PI);
		context.fill();
 	}

 	//draw enemies
 	for (var i = 0; i < enemys.length; i++) {
 		enemys[i].render()
 	}
}

function update() {
	//cam update
	shake=lerp(shake,0,0.05)
	Boffset = {x:lerp(offset.x,curRoom.x*size-canvas.width/2+size/2,camSpeed),y:lerp(offset.y,curRoom.y*size-canvas.height/2+size/2,camSpeed)}
  offset.x = Boffset.x+(Math.random()*2-1)*shake
  offset.y = Boffset.y+(Math.random()*2-1)*shake

	//move player
	{
		if (db) shootCount++
		if (shootCount >= shootLimit) {
			shootCount = 0
			db = false
		} 

		player.move = 0
		player.strafe = 0
		if (keys[87]) player.move += 1
		if (keys[83]) player.move -= 1
		if (keys[68]) player.strafe += 1
		if (keys[65]) player.strafe -= 1

		if (keys[38] && !db) {db = true; bullets.push(new bullet(1,"player")); shake+=1}
		if (keys[39] && !db) {db = true; bullets.push(new bullet(2,"player")); shake+=1}
		if (keys[40] && !db) {db = true; bullets.push(new bullet(3,"player")); shake+=1}
		if (keys[37] && !db) {db = true; bullets.push(new bullet(4,"player")); shake+=1}

		if (keys[32] && getRoom(curRoom)) if (getRoom(curRoom).exit == -1) {
			nextFloor()
		}

		if (player.move != 0){

			player.position.y -= player.move / 32 * player.speed

		  let positions = [{x:size/2-size*0.05,y:0},{x:size-size*0.05,y:size/2-size*0.05},{x:size/2-size*0.05,y:size-size*0.05},{x:0,y:size/2-size*0.05}]
		  let sizes = [{x:size*0.1,y:size*0.05},{x:size*0.05,y:size*0.1},{x:size*0.1,y:size*0.05},{x:size*0.05,y:size*0.1}]
			curRoom.x = Math.floor(player.position.x/size)
			curRoom.y = Math.floor(player.position.y/size)
			let curCRoom = getRoom(curRoom)
			if(curCRoom == null){
				curCRoom = generateRoom(map[map.length-1])
			}
			let main = (player.position.x >= curCRoom.position.x*size+size*0.05 && player.position.x <= curCRoom.position.x*size+size-size*0.05 && player.position.y >= curCRoom.position.y*size+size*0.05 && player.position.y <= curCRoom.position.y*size+size-size*0.05)
			let entr = (curCRoom.entr != -1 && player.position.x <= positions[curCRoom.entr].x+curCRoom.position.x*size+sizes[curCRoom.entr].x  && player.position.x >= positions[curCRoom.entr].x+curCRoom.position.x*size && player.position.y >= positions[curCRoom.entr].y+curCRoom.position.y*size && player.position.y <= positions[curCRoom.entr].y+curCRoom.position.y*size+sizes[curCRoom.entr].y)
			let exit = (curCRoom.exit != -1 && player.position.x <= positions[curCRoom.exit].x+curCRoom.position.x*size+sizes[curCRoom.exit].x  && player.position.x >= positions[curCRoom.exit].x+curCRoom.position.x*size && player.position.y >= positions[curCRoom.exit].y+curCRoom.position.y*size && player.position.y <= positions[curCRoom.exit].y+curCRoom.position.y*size+sizes[curCRoom.exit].y)
			
			if (enemys.length != 0 && exit == true) {
				entr = false
				main = false
				exit = false
			} 

			if (!(exit || main || entr)) {
				player.position.y += player.move / 32 * player.speed
			}
			curRoom.x = Math.floor(player.position.x/size)
			curRoom.y = Math.floor(player.position.y/size)

		} 
		if (player.strafe != 0) {

			player.position.x += player.strafe / 32 * player.speed

		  let positions = [{x:size/2-size*0.05,y:0},{x:size-size*0.05,y:size/2-size*0.05},{x:size/2-size*0.05,y:size-size*0.05},{x:0,y:size/2-size*0.05}]
		  let sizes = [{x:size*0.1,y:size*0.05},{x:size*0.05,y:size*0.1},{x:size*0.1,y:size*0.05},{x:size*0.05,y:size*0.1}]
			curRoom.x = Math.floor(player.position.x/size)
			curRoom.y = Math.floor(player.position.y/size)
			let curCRoom = getRoom(curRoom)
			if(curCRoom == null){
				curCRoom = generateRoom(map[map.length-1])
			}
			let main = (player.position.x >= curCRoom.position.x*size+size*0.05 && player.position.x <= curCRoom.position.x*size+size-size*0.05 && player.position.y >= curCRoom.position.y*size+size*0.05 && player.position.y <= curCRoom.position.y*size+size-size*0.05)
			let entr = (curCRoom.entr != -1 && player.position.x <= positions[curCRoom.entr].x+curCRoom.position.x*size+sizes[curCRoom.entr].x  && player.position.x >= positions[curCRoom.entr].x+curCRoom.position.x*size && player.position.y >= positions[curCRoom.entr].y+curCRoom.position.y*size && player.position.y <= positions[curCRoom.entr].y+curCRoom.position.y*size+sizes[curCRoom.entr].y)
			let exit = (curCRoom.exit != -1 && player.position.x <= positions[curCRoom.exit].x+curCRoom.position.x*size+sizes[curCRoom.exit].x  && player.position.x >= positions[curCRoom.exit].x+curCRoom.position.x*size && player.position.y >= positions[curCRoom.exit].y+curCRoom.position.y*size && player.position.y <= positions[curCRoom.exit].y+curCRoom.position.y*size+sizes[curCRoom.exit].y)
			
			if (enemys.length != 0 && exit == true) {
				entr = false
				main = false
				exit = false
			} 

			if (!(exit || main || entr)) {
				player.position.x -= player.strafe / 32 * player.speed
			}
			curRoom.x = Math.floor(player.position.x/size)
			curRoom.y = Math.floor(player.position.y/size)

		}
	}

	//move bullets
  for (var i = 0; i < bullets.length; i++) {
  	bullets[i].update(i)
  }

	//move enemies
 	for (var i = 0; i < enemys.length; i++) {
 		enemys[i].update()
 	}
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
	
	// 1) menu
	// 0) playing
	// 2) paused

	if (menuState == 1) {
		context.fillStyle = "#3D3D90";
		context.fillRect(0,0,canvas.width,canvas.height)
		
		context.fillStyle = "#1D3F6E";
		context.fillRect(canvas.width/2-100,canvas.height/2-30,200,60)

		context.fillStyle = '#ffffff';
		context.font = '50px Monospace';
		context.fillText("Menu", 0, 250);
	} else 
	if (menuState == 0){
		//health handler
		if (cycleCount == 0 && player.health < player.maxHealth-player.maxHealth/1000) {
			player.health+=player.maxHealth/1000
		} 

		render()
		update()


	} else 
	if (menuState == 2){
		render()
		context.globalAlpha = 0.5
		context.fillStyle = "#000000";
		context.fillRect(0,0,canvas.width,canvas.height)
		context.globalAlpha = 1
		
		// draw overlay
		context.fillStyle = "#3f3f3f";
		context.fillRect(canvas.width/2-100,canvas.height/2-30,200,60)
		context.fillStyle = "#5f5f5f"
		context.fillRect(canvas.width/2-100+5,canvas.height/2-30+5,200-10,60-10)
		context.textAlign = "center"
		context.font = '50px Monospace';
   	context.strokeStyle = '#000000';
		context.lineWidth = 10;
		context.strokeText("Resume", canvas.width/2, canvas.height/2+15)
		context.fillStyle = '#ffffff';
		context.fillText("Resume", canvas.width/2, canvas.height/2+15)

		context.fillStyle = "#3f3f3f";
		context.fillRect(canvas.width/2-500,canvas.height/2+195,1000,-100)

		for (let v in shopItems) {
			let shopItem = shopItems[v]
			let len = shopItems.length
			let p1 = new vector2(canvas.width/2-500+1000/len*v,canvas.height/2+195)

			context.fillStyle = "#5f5f5f"
			context.fillRect(p1.x+5,p1.y-5,1000/len-10,-90)

			context.textAlign = "center"
			context.miterLimit = 3
			context.font = '40px Monospace';
	   	context.strokeStyle = '#000000';
			context.lineWidth = 8;
			context.strokeText(shopItem.name+":"+shopItem.timesBought, p1.x+1000/len/2, p1.y-110/2);
			context.fillStyle = 'white';
			context.fillText(shopItem.name+":"+shopItem.timesBought, p1.x+1000/len/2, p1.y-110/2);
			
			context.font = '35px Monospace';
			if (shopItem.timesBought < shopItem.max) {
		    context.strokeText(shopItem.price*(shopItem.timesBought+1)+"$", p1.x+1000/len/2, p1.y-25/2);
		    context.fillText(shopItem.price*(shopItem.timesBought+1)+"$", p1.x+1000/len/2, p1.y-25/2);
			} else {
		    context.strokeText("Max", p1.x+1000/len/2, p1.y-25/2);
		    context.fillText("Max", p1.x+1000/len/2, p1.y-25/2);
			}


			context.textAlign = "start"
		}

		if (mouse.x >= canvas.width/2-500 && mouse.x <= canvas.width/2+500) {
			scrollMenu1 = mouse.x
		} else
		if(mouse.x >= canvas.width/2-500) {
			scrollMenu1 = canvas.width/2+500
		} else 
		if(mouse.x <= canvas.width/2+500) {
			scrollMenu1 = canvas.width/2-500
		}

		scrollMenu2 = lerp(scrollMenu2,scrollMenu1,0.2)
		
		context.fillStyle = "#3f3f3f";
		context.beginPath();
		context.arc(scrollMenu2+size/80,canvas.height/2+195+size/40, size/40, 0, DOUBLE_PI);
		context.arc(scrollMenu2-size/80,canvas.height/2+195+size/40, size/40, 0, DOUBLE_PI);
		context.moveTo(scrollMenu2-size/25,canvas.height/2+195+size/40)
		context.lineTo(scrollMenu2,canvas.height/2+160+size/20)
		context.lineTo(scrollMenu2+size/25,canvas.height/2+195+size/40)
		context.fill();
		context.fillRect(scrollMenu2-size/60,canvas.height/2+195-size/20+size/20,size/36,size/20)

		context.fillStyle = "#5f5f5f";
		context.beginPath();
		context.arc(scrollMenu2+size/80,canvas.height/2+195+size/40, size/80, 0, DOUBLE_PI);
		context.arc(scrollMenu2-size/80,canvas.height/2+195+size/40, size/80, 0, DOUBLE_PI);
		context.moveTo(scrollMenu2-size/35,canvas.height/2+195+size/40)
		context.lineTo(scrollMenu2,canvas.height/2+160+size/15)
		context.lineTo(scrollMenu2+size/35,canvas.height/2+195+size/40)
		context.fill();
		context.fillRect(scrollMenu2-size/60,canvas.height/2+195-size/20+size/20,size/36,size/25)

		context.fillStyle = '#ffffff';
		context.font = '50px Monospace';
		context.fillText("Paused", 0, 250);
	}	
	
	setTimeout(gameLoop, cycleDelay);
	
	context.fillStyle = '#ffffff';
	context.textAlign = "start"
	context.font = '50px Monospace';
	context.fillText("Fps:"+fps_rate, 0, 50);
	context.fillText("Ver:"+40, 0, 100);
	context.fillText("Cur:"+player.curency, 0, 150);
	context.fillText("Chances:"+chances, 0, 200);
}
window.onload = function() {
	console.log("loaded"); 
	sessionStorage.setItem("weights", JSON.stringify(chances));
	gameLoop()
}