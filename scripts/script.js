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
const link = document.querySelector('a');
const href = link.getAttribute('href'); 
const currentDirectory = href.substring(0, href.lastIndexOf('/'));
const assests =  currentDirectory + '/assests'

// images
var groundTEX = new Image();
groundTEX.src = "assests/images/groundTEX.png";

var base_image = new Image();
base_image.src = "assests/images/exit.png";

var imgages = 0
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
		// this.color = "#" + Math.floor(Math.random()*16777215).toString(16)
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
			if (randInt(1,100) >= player.doge*2)player.health -= 2-player.restance/10
			shake+=1
		}
	}

	render() {
		context.save()
		context.translate(this.position.x - offset.x, this.position.y - offset.y)
		context.rotate(-Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))
		context.drawImage(this.img,-this.size.x/2,-this.size.y/2,this.size.x,this.size.y)
		context.restore()
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
		context.save()
		context.translate(this.position.x - offset.x, this.position.y - offset.y)
		context.rotate(-Math.atan2(this.position.x - mouse.x - offset.x,this.position.y - mouse.y - offset.y))
		context.drawImage(this.img,-this.size.x/2,-this.size.y/2,this.size.x,this.size.y)
		context.restore()
	}

	update() {
		if (((this.position.x-mouse.x- offset.x)**2+(this.position.y-mouse.y - offset.y)**2)**0.5 >= (this.size.x)/2) {
			this.position.x -= Math.sin(Math.atan2(this.position.x - mouse.x - offset.x,this.position.y - mouse.y - offset.y))/16*this.speed
			this.position.y -= Math.cos(Math.atan2(this.position.x - mouse.x - offset.x,this.position.y - mouse.y - offset.y))/16*this.speed
		} else {
			if (randInt(1,100) >= player.doge*2) player.health -= 1.5-player.restance/10
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
		context.save()
		context.translate(this.position.x - offset.x, this.position.y - offset.y)
		context.rotate(-Math.atan2(this.position.x - mouse.x - offset.x,this.position.y - mouse.y - offset.y))
		context.drawImage(this.img,-this.size.x/2,-this.size.y/2,this.size.x,this.size.y)
		context.restore()
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
			if (randInt(1,100) >= player.doge*2) player.health -= 2.5-player.restance/10
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
		this.shootLimti = randInt(60,90)
		this.count = randInt(1,Math.floor(this.shootLimti/2))
		this.teir = 1
		this.dir = [0,Math.PI/2,Math.PI,Math.PI*1.5][this.side-1]
	}

	render() {
		// context.drawImage(this.img,this.position.x - offset.x - this.size.x / 2,this.position.y - offset.y - this.size.y/2,this.size.x,this.size.y)
		context.save()
		context.translate(this.position.x - offset.x,this.position.y - offset.y)
		context.rotate(this.dir)
		context.drawImage(this.img,-this.size.x/2,-this.size.y/2,this.size.x,this.size.y)
		context.restore()
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
			new Audio("assests/audio/shoot.mp3").play()
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
		context.save()
		context.translate(this.position.x - offset.x, this.position.y - offset.y)
		context.rotate(-Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))
		context.drawImage(this.img,-this.size.x/2,-this.size.y/2,this.size.x,this.size.y)
		context.restore()
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
			if (randInt(1,100) >= player.doge*2) player.health -= 5-player.restance/10
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
		this.speed = size/16*0.7*(randInt(800,1200)/1000)*2
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
		context.save()
		context.translate(this.position.x - offset.x, this.position.y - offset.y)
		context.rotate(-Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))
		context.drawImage(this.img,-this.size.x/2,-this.size.y/2,this.size.x,this.size.y)
		context.restore()
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
			shake += 5
			if (randInt(1,100) >= player.doge*2) player.health -= 50-player.restance/10
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
		context.save()
		context.translate(this.position.x - offset.x, this.position.y - offset.y)
		context.rotate(-Math.atan2(this.position.x - player.position.x,this.position.y - player.position.y))
		context.drawImage(this.img,-this.size.x/2,-this.size.y/2,this.size.x,this.size.y)
		context.restore()
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
			if (randInt(1,100) >= player.doge*2) player.health -= 5-player.restance/10
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
		this.regenSpeed = 0
		this.doge = 0
		this.restance = 0
		this.img = new Image();
		this.img.src = "assests/images/player.png";
		this.dir = 0
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

		if (this.type == "enemy" && (Math.sqrt(Math.pow(this.position.x-player.position.x,2)+Math.pow(this.position.y-player.position.y,2)) <= size/30*1.3333)) {
			shake += 5
			if (randInt(1,100) >= player.doge*2) player.health -= 25-player.restance/10
			bullets.splice(pos,1)
		}

		if (this.type == "player") {
			for (let v in enemys) {
				if (Math.sqrt(Math.pow(this.position.x-enemys[v].position.x,2)+Math.pow(this.position.y-enemys[v].position.y,2)) <= size/30) {
					enemys[v].hit(pos,v)
					new Audio("assests/audio/hit.mp3").play()
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
  constructor(pos,entr,exit,dirt,abilty = null) {
    this.position = pos
    this.exit = exit
    this.entr = entr
    this.dirt = dirt
    this.abilty = abilty
    this.imgPos = {x: Math.floor(Math.random() * (800 - size/16)), y: Math.floor(Math.random() * (800 - size/16))}
  }

  interact() {
  	if (this.abilty == "+regen") player.regenSpeed += 1
  	if (this.abilty == "+doge chance") player.doge += 2
  	if (this.abilty == "+restance") player.restance += 1
  	if (this.abilty == "++regen") player.regenSpeed += 2
  	if (this.abilty == "++doge chance") player.doge += 4
  	if (this.abilty == "++restance") player.restance += 2
  	this.abilty = null
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
{name:"Shoot Speed",price:10,timesBought:0,max:12},
{name:"Walk Speed",price:4,timesBought:0,max:16},
{name:"Good Pick up",price:0,timesBought:0,max:3200}
] 
var chances = [100,0,0]
//new vars

var mapCount = 1
var camSpeed = 0.1
var size = WIDTH || HEIGHT
var map = [new room({x:0,y:0}, -1, randInt(0,3),"B")]
var curRoom = {x:0,y:0}
var Boffset = {x:curRoom.x*size-canvas.width/2+size/2,y:curRoom.y*size-canvas.height/2+size/2}
var offset = {x:curRoom.x*size-canvas.width/2+size/2,y:curRoom.y*size-canvas.height/2+size/2}
var player = new Player()
var puddles = []
var shake = 0
var tut = true

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
			        } else if (i == 4) {
						  	let chances = [5,5,5,1,1,1]
						  	let abitlys = ["+regen","+doge chance","+restance","++regen","++doge chance","++restance"]
						  	abilty = weighted_random(abitlys,chances)
						  	if (abilty == "+regen") player.regenSpeed += 1
						  	if (abilty == "+doge chance") player.doge += 2
						  	if (abilty == "+restance") player.restance += 1
						  	if (abilty == "++regen") player.regenSpeed += 2
						  	if (abilty == "++doge chance") player.doge += 4
						  	if (abilty == "++restance") player.restance += 2
			        }
							new Audio("assests/audio/button.mp3").play()
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
			} else {
				menuState = 0
			}
		} if (event.keyCode == 67) {
			tut = !tut
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

function weighted_random(items,chances) {
  let i;
  let a = chances
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
	  let chances = JSON.parse(sessionStorage.getItem("weights"))	
		let chance = weighted_random(["common","rare","epic"],chances)
		console.log(chance)
		if (chance == "common") {
			var a = randInt(1,3)
			if (a == 1) {
				enemys.push(new runner())
			}if (a == 2) {
				enemys.push(new shooter())
			}if (a == 3) {
				enemys.push(new ghost())
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
  let abilty = null

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
	  if (randInt(1,2)==1 && floor != 1) {
	  	let chances = [5,5,5,1,1,1]
	  	let abitlys = ["+regen","+doge chance","+restance","++regen","++doge chance","++restance"]
	  	abilty = weighted_random(abitlys,chances)
	  }
  }

  let newRoom = new room(position,entr,exit,directions[entr][exit],abilty)
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
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
	let startColor = '#202020'

	var r = Math.round((53/12)*(floor-1)+32).toString(16);
  var g = Math.round((-29/24)*(floor-1)+32).toString(16);
  var b = Math.round((-29/24)*(floor-1)+32).toString(16);
  r = r.length == 1 ? "0" + r : r;
  g = g.length == 1 ? "0" + g : g;
  b = b.length == 1 ? "0" + b : b;
  startColor = "#" + r + g + b;

  let endColor = '#000000' 

  var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2)
  gradient.addColorStop(0, startColor)
  gradient.addColorStop(1, endColor)
  context.fillStyle = gradient
	context.fillRect(0,0,canvas.width,canvas.height)

  let positions = [{x:size/2-size*0.05,y:0},{x:size-size*0.05,y:size/2-size*0.05},{x:size/2-size*0.05,y:size-size*0.05},{x:0,y:size/2-size*0.05}]
  let sizes = [{x:size*0.1,y:size*0.05},{x:size*0.05,y:size*0.1},{x:size*0.1,y:size*0.05},{x:size*0.05,y:size*0.1}]
  let imgPos = [{x:11,y:-1},{x:25,y:-11},{x:11,y:-25},{x:-1,y:11}]
  let imgSize = [{x:3,y:2},{x:2,y:3},{x:3,y:2},{x:2,y:3}]
  
  for (var i = 0; i < map.length; i++) {

		context.fillStyle = "#2E2E2E"
    context.fillRect(map[i].position.x*size - offset.x ,map[i].position.y*size - offset.y ,size,size)
		
		context.fillStyle = "#605853"
    context.fillRect(map[i].position.x*size+size*0.05 - offset.x ,map[i].position.y*size+size*0.05 - offset.y ,size-size*0.1,size-size*0.1)

    if (map[i].entr != -1) {
    	if (enemys.length == 0 || (map[i].position.x == curRoom.x && map[i].position.y == curRoom.y)) {
	      context.fillStyle = "#605853"
	      context.fillRect(positions[map[i].entr].x+map[i].position.x*size - offset.x ,positions[map[i].entr].y+map[i].position.y*size - offset.y ,sizes[map[i].entr].x,sizes[map[i].entr].y)
	    }
    }

    if (map[i].exit != -1) {
    	if (enemys.length == 0) {
		    context.fillStyle = "#605853"
		    context.fillRect(positions[map[i].exit].x+map[i].position.x*size - offset.x ,positions[map[i].exit].y+map[i].position.y*size - offset.y ,sizes[map[i].exit].x,sizes[map[i].exit].y)
    	}else {
		    context.fillStyle = "#7B3F00"
		    context.fillRect(positions[map[i].exit].x+map[i].position.x*size - offset.x ,positions[map[i].exit].y+map[i].position.y*size - offset.y ,sizes[map[i].exit].x,sizes[map[i].exit].y)
    	}
    } else {
    	context.drawImage(base_image,map[i].position.x*size - offset.x + size/2 - size*0.2,map[i].position.y*size - offset.y + size / 2 - size*0.2,size*0.4,size*0.4)
    }

		context.imageSmoothingEnabled = false
		context.globalAlpha = 0.03
	  context.drawImage(groundTEX, map[i].imgPos.x, map[i].imgPos.y, size/16, size/16, map[i].position.x*size+size*0.05 - offset.x, map[i].position.y*size+size*0.05 - offset.y, size-size*0.1, size-size*0.1);
	  // context.drawImage(groundTEX, map[i].imgPos.x, map[i].imgPos.y, size/16, size/16, map[i].position.x*size - offset.x, map[i].position.y*size - offset.y, size, size);
		context.globalAlpha = 1

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
		// context.fillStyle = "#"+Math.floor(lerp(255,16,player.health/player.maxHealth)).toString(16)+Math.floor(lerp(16,255,player.health/player.maxHealth)).toString(16)+"00";
		context.save()
		context.translate(player.position.x-offset.x, player.position.y-offset.y)
		context.rotate(Math.PI/2*player.dir)
		context.drawImage(player.img,-size/30,-size/30,size/15,size/15)
		context.restore()
 	}

 	//draw enemies
 	for (var i = 0; i < enemys.length; i++) {
 		enemys[i].render()
 	}

 	//draw warning 
 	if (getRoom(curRoom).abilty != null && enemys.length == 0) {
		context.textAlign = "center"
		context.miterLimit = 3
		context.font = '30px Monospace';
		context.fillStyle = '#'+Math.floor(Math.random() * 16777215).toString(16);
   	context.strokeStyle = '#000000';
		context.lineWidth = 8;
		context.strokeText("There is something in this room", canvas.width/2, canvas.height/2+size/2+20);
		context.fillText("There is something in this room", canvas.width/2, canvas.height/2+size/2+20);
	}

	if (tut) {
		context.textAlign = "right";
		context.textBaseline = "top"
		context.font = '30px Monospace';
		context.fillStyle = "#ffffff"
		let height = context.measureText("M").width * 1.6
		context.fillText("WASD to move", canvas.width, 0)
		context.fillText("Arrow keys to shoot", canvas.width, height)
		context.fillText("Space to interact with room", canvas.width, height*2)
		context.fillText("Esc to pause the game", canvas.width, height*3)
		context.fillText("C to toggle this information", canvas.width, height*4)
		context.textBaseline = "alphabetic"	
	}
}

function update() {
	//cam update
	shake=lerp(shake,0,0.05)
	Boffset = {x:lerp(offset.x,curRoom.x*size-canvas.width/2+size/2,camSpeed),y:lerp(offset.y,curRoom.y*size-canvas.height/2+size/2,camSpeed)}
  offset.x = Boffset.x+(Math.random()*2-1)*shake
  offset.y = Boffset.y+(Math.random()*2-1)*shake
	// console.log(shake)
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
		if (player.strafe != 0 && player.move != 0) {player.strafe /= 1.5; player.move /= 1.5}

		if (keys[38] && !db) {db = true; bullets.push(new bullet(1,"player")); shake+=1; new Audio("assests/audio/shoot.mp3").play(); player.dir = 0}
		if (keys[39] && !db) {db = true; bullets.push(new bullet(2,"player")); shake+=1; new Audio("assests/audio/shoot.mp3").play(); player.dir = 1}
		if (keys[40] && !db) {db = true; bullets.push(new bullet(3,"player")); shake+=1; new Audio("assests/audio/shoot.mp3").play(); player.dir = 2}
		if (keys[37] && !db) {db = true; bullets.push(new bullet(4,"player")); shake+=1; new Audio("assests/audio/shoot.mp3").play(); player.dir = 3}

		if (getRoom(curRoom).abilty != null && enemys.length == 0 && keys[32]) {
			getRoom(curRoom).interact()
		}

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
	// 2) pause

	player.regenSpeed = Math.max(0, Math.min(player.regenSpeed, 500))
	player.doge = Math.max(0, Math.min(player.doge, 50))
	player.restance = Math.max(0, Math.min(player.restance, 500))

	if (menuState == 1) {
		let startColor = '#202020'

		var r = Math.round((53/12)*(floor-1)+32).toString(16);
	  var g = Math.round((-29/24)*(floor-1)+32).toString(16);
	  var b = Math.round((-29/24)*(floor-1)+32).toString(16);
	  r = r.length == 1 ? "0" + r : r;
	  g = g.length == 1 ? "0" + g : g;
	  b = b.length == 1 ? "0" + b : b;
	  startColor = "#" + r + g + b;

	  let endColor = '#000000' 
	  
	  var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2)
	  gradient.addColorStop(0, startColor)
	  gradient.addColorStop(1, endColor)
	  context.fillStyle = gradient
		context.fillRect(0,0,canvas.width,canvas.height)
		
		context.fillStyle = "#202020";
		context.fillRect(canvas.width/2-100,canvas.height/2-30,200,60)
		context.fillStyle = "#404040";
		context.fillRect((canvas.width/2-100)+60*0.1,(canvas.height/2-30)+60*0.1,200-60*0.2,60-60*0.2)
		context.textAlign = "center"
		context.font = '45px Monospace';
   	context.strokeStyle = '#000000';
		context.lineWidth = 10;
		context.strokeText("Play", canvas.width/2, canvas.height/2+12)
		context.fillStyle = '#ffffff';
		context.fillText("Play", canvas.width/2, canvas.height/2+12)

		context.textAlign = "start"
		context.fillStyle = '#ffffff';
		context.font = '50px Monospace';
		context.fillText("Menu", 0, 250);
	} else 
	if (menuState == 0){
		//health handler
		if (player.health <= 0) {
			chances[0]=100
			chances[1]=0
			chances[2]=0
			sessionStorage.setItem("weights", JSON.stringify(chances));
			enemys = []
			bullets = []
			puddles = []
			map = [new room({x:0,y:0}, -1, randInt(0,3),"B")]
			player.position = {x:size/2,y:size/2}
			player.maxHealth = 100
			player.health = player.maxHealth
			player.speed = size/8
			shopItems = [
				{name:"Max Health",price:2,timesBought:0,max:18},
				{name:"Shoot Speed",price:10,timesBought:0,max:12},
				{name:"Walk Speed",price:4,timesBought:0,max:16},
				{name:"Good Pick up",price:0,timesBought:0,max:3200}
			] 
			player.curency = 0
			shake = 0
			shootLimit = 61
			floor = 1
			mapCount = 1
			curRoom = {x:0,y:0}
			offset = {x:curRoom.x*size-canvas.width/2+size/2,y:curRoom.y*size-canvas.height/2+size/2}
		}
		if (cycleCount == 0 && player.health < player.maxHealth-player.maxHealth/1000) {
			player.health+=player.maxHealth/1000*(player.regenSpeed/10)
		} 
		if (player.health > player.maxHealth) {
			player.health = player.maxHealth
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

		//draw play button
		context.fillStyle = "#3f3f3f";
		context.fillRect(canvas.width/2-100,canvas.height/2-30,200,60)
		context.fillStyle = "#5f5f5f"
		context.fillRect(canvas.width/2-100+5,canvas.height/2-30+5,200-10,60-10)

		//play text
		context.textAlign = "center"
		context.font = '50px Monospace';
   	context.strokeStyle = '#000000';
		context.lineWidth = 10;
		context.strokeText("Resume", canvas.width/2, canvas.height/2+15)
		context.fillStyle = '#ffffff';
		context.fillText("Resume", canvas.width/2, canvas.height/2+15)

		context.fillStyle = "#3f3f3f";
		context.fillRect(canvas.width/2-500,canvas.height/2+195,1000,-100)

		context.fillStyle = "#3f3f3f";
		context.fillRect(canvas.width/2-500,canvas.height/2-195/2,1000,-100)

		let textsa = ["Regen Speed","Doge Chance","Resistance","IDK ATM"]
		let textsav = [player.regenSpeed/10,player.doge,player.restance/10,"nill"]
		for (var i = 0; i < 4; i++) {
			let px = canvas.width/2-500+1000/4*i
			let py = canvas.height/2-195/2
			context.fillStyle = "#5f5f5f"
			context.fillRect(px+5, py-5,240,-90)

			context.textAlign = "center"
			context.miterLimit = 3
			context.font = '30px Monospace';
	   	context.strokeStyle = '#000000';
			context.fillStyle = 'white';
			context.lineWidth = 8;
			context.strokeText(textsa[i], px+1000/4/2, py-110/2);
			context.fillText(textsa[i], px+1000/4/2, py-110/2);
	    context.strokeText(textsav[i], px+1000/4/2, py-20);
	    context.fillText(textsav[i], px+1000/4/2, py-20);
		} 

		for (let v in shopItems) {
			let shopItem = shopItems[v]
			let len = shopItems.length
			let p1 = new vector2(canvas.width/2-500+1000/len*v,canvas.height/2+195)

			context.fillStyle = "#5f5f5f"
			context.fillRect(p1.x+5,p1.y-5,1000/len-10,-90)

			context.textAlign = "center"
			context.miterLimit = 3
			context.font = '30px Monospace';
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
	// context.fillText("Ver:"+40, 0, 100);
	context.fillText("Cur:"+player.curency, 0, 100);
	// context.fillText("Chances:"+chances, 0, 200);
}
window.onload = function() {
	console.log("loaded"); 
	sessionStorage.setItem("weights", JSON.stringify(chances));
	gameLoop()
}