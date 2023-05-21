const platform = new Image()
platform.src = './images/platform.png';
const background = new Image();
background.src = './images/background.png';
const hills = new Image();
hills.src = './images/hills.png';
const smallPlatform = new Image();
smallPlatform.src = './images/platformSmallTall.png';
const runLeft = new Image();
runLeft.src = './images/spriteRunLeft.png';
const runRight = new Image();
runRight.src = './images/spriteRunRight.png';
const standLeft = new Image();
standLeft.src = './images/spriteStandLeft.png';
const standRight = new Image();
standRight.src = './images/spriteStandRight.png';


const canvas = document.querySelector('canvas');
canvas.width = 1024;
canvas.height = 650;

const context = canvas.getContext('2d');
const gravity = 0.5;
let scrollOffset = 0;

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },

}


//player 

class Player {
    constructor() {
        this.position = {
            x : 120, 
            y : 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 66;
        this.height = 150;
        this.image = standRight;
        this.frames = 0;
        this.sprites = {
            stand: {
                right: standRight, 
                cropWidth: 177,
                width: this.width,
                left: standLeft

            }, 
            run: {
                right: runRight,
                cropWidth: 340,
                width: 127.875,
                left : runLeft
            },
        }

        this.currentSprite = this.sprites.stand.right;
        this.currentCropWidth = this.sprites.stand.cropWidth;
    }

    draw() {

        context.beginPath();
        context.drawImage(this.currentSprite, 
            this.currentCropWidth * this.frames, 0, this.currentCropWidth , 400,
            this.position.x, this.position.y, this.width, this.height);

    }

    update() {

        this.frames++;

        if(this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) this.frames = 0;
        else if(this.frames > 29 && (this.currentSprite == this.sprites.run.right || this.currentSprite === this.sprites.run.left)) this.frames = 0;
        this.draw()

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y <= canvas.height) {
            
            this.velocity.y += gravity;   
        } 
        
    }
}


class Platform {
    constructor({x, y}, image){
        this.position = {
            x,y
        }
        this.image = image;
        this.width = this.image.width;
        this.height = this.image.height;
        
    }

    draw() {
        context.drawImage(this.image, this.position.x, this.position.y);

    }
}

class GenericObject {
    constructor({x, y}, image){
        this.position = {
            x,y
        }
        this.image = image;
        this.width = this.image.width;
        this.height = this.image.height;
        
    }

    draw() {
        context.drawImage(this.image, this.position.x, this.position.y);

    }
}

let player;
let platforms ;
let genericObjects;

function init() {

    player = new Player();
    platforms = [new Platform({x: -1, y: 525}, platform), new Platform({x: platform.width - 3, y: 525}, platform), new Platform({x: 2 * platform.width + 200, y: 525}, platform),new Platform({x: 3 * platform.width - 3, y: 525}, platform), new Platform({x: 4 * platform.width + 150, y: 525}, platform), new Platform({x: 5 * platform.width + 280, y: 525}, platform), new Platform({x: 6 *  platform.width, y: 525}, platform),new Platform({x: 7 * platform.width - 3, y: 525}, platform), new Platform({x: 8 * platform.width + 100, y: 400}, smallPlatform), new Platform({x: 9 * platform.width + 20, y: 300}, smallPlatform), new Platform({x: 10 * platform.width + 50, y: 525}, platform), new Platform({x: 11 * platform.width -3, y: 525}, platform), new Platform({x: 12 * platform.width -5, y: 525}, platform), new Platform({x: 12 * platform.width + smallPlatform.width - 6, y: 300}, smallPlatform), new Platform({x: 13 * platform.width + 350, y: 525}, platform), new Platform({x: 14 * platform.width + 344, y: 525}, platform)]
    genericObjects = [new GenericObject({x: -1, y: 0}, background), new GenericObject({x: -1, y: -1}, hills)];
}

init()

// adding event listener

addEventListener('keydown', ({keyCode})=>{

    switch(keyCode) {
        case 65:
            keys.left.pressed = true
            player.currentSprite = player.sprites.run.left;
            player.currentCropWidth = player.sprites.run.cropWidth;
            player.width = player.sprites.run.width;
            break;
        case 83:

        //down
            console.log('down')
            break;
        case 68:

        //right
            keys.right.pressed = true;
            player.currentSprite = player.sprites.run.right;
            player.currentCropWidth = player.sprites.run.cropWidth;
            player.width = player.sprites.run.width;
            break;
        case 87:

        //up
            player.velocity.y -= 15;
            break;
    }

})


addEventListener('keyup', ({keyCode})=>{

    switch(keyCode) {
        case 65:
            // left
           keys.left.pressed = false;
           player.currentSprite = player.sprites.stand.left;
           player.currentCropWidth = player.sprites.stand.cropWidth;
           player.width = player.sprites.stand.width;
            break;
        case 83:
            //down
            break;
        case 68:
            // right key
            keys.right.pressed = false;
            player.currentSprite = player.sprites.stand.right;
            player.currentCropWidth = player.sprites.stand.cropWidth;
            player.width = player.sprites.stand.width;
            break;
        case 87:
            //up
            break;    
    }

})

function animate() {
    requestAnimationFrame(animate);
    context.fillStyle = `rgba(255, 255, 255)`
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    genericObjects.forEach((object) =>{
        object.draw();
    })

    //platform making 
    platforms.forEach((platform)=>{
        platform.draw();
    })
    
    player.update();


    //controller keys
    if(keys.right.pressed && player.position.x < 400) {
        scrollOffset += 5
        player.velocity.x = 5;
    } else if(keys.left.pressed && player.position.x >= player.width  && player.position.x > 100){
        scrollOffset -=5;
        player.velocity.x = -5;
    } else {
        player.velocity.x = 0;

        if(keys.right.pressed){

            genericObjects.forEach((object)=>{
                object.position.x -= 3;
            })
            platforms.forEach((platform)=>{
                platform.draw();
                platform.position.x -= 5;
                
            })

            scrollOffset += 5
            
        } else if(keys.left.pressed && scrollOffset > 0) {
            genericObjects.forEach((object)=>{
                object.position.x += 3;
            })
            platforms.forEach((platform)=>{
                platform.draw();
                platform.position.x += 5;
            })
            scrollOffset -= 5
        }
    }

    // rectangular collision detection
    platforms.forEach((platform)=>{
    if(player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >=platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
        player.velocity.y = 0
    } 
})
// win condition

if(scrollOffset > 8490) {
    
    console.log('you win');
}
// loss condition
if(player.position.y > canvas.height) {
    scrollOffset = 0;
    init();
}
// console.log(scrollOffset);
}

animate();





