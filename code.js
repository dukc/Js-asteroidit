function Asteroid()
{ this.x = Math.random() * 800 - 80;
  this.y = 0;
  this.dx = 4.8 + (Math.random() * 6.4 - 3.2) - this.x * .015;
  this.dy = 6 - Math.abs(this.dx) * .25;

  //paluuarvo: onko asteroidi poistunut kentältä
  this.step = () =>
  { this.x += this.dx;
    this.y += this.dy;

    return this.y >= 480;
  }
}

function GameData()
{ //jos null, tuhoutunut
  this.ship =
  { x:300, y:440, width:40, height:40,
    image: document.getElementById("ship-img")
  }

  this.inputX = 0;
  this.inputY = 0;

  this.score = 0;

  this.asteroids = new Array(10);
  for(let i = 0; i<4; i++){this.asteroids[i] =new Asteroid();}
  this.asteroids.fill(null, 4);


  this.step = () =>
  { var ship = this.ship;
    if(ship !== null)
    { ship.x += this.inputX * 8;
      ship.y += this.inputY * 8;

      if(ship.x < 0) ship.x = 0;
      if(ship.x + ship.width >= 640) ship.x = 639 - ship.width;
      if(ship.y < 0) ship.y = 0;
      if(ship.y + ship.height >= 480) ship.y = 479 - ship.height;
    }

    for(let i = 0; i < this.asteroids.length; i++)
    { var a = this.asteroids[i];
      if(a === null)
      { if(Math.random() > .99) this.asteroids[i] = new Asteroid();
      }
      else if(a.step())
      { this.asteroids[i] = null;
        if(ship !== null && ++this.score % 10 == 0)
        { this.asteroids.push(null, null);
        }
      }
      else if
      ( ship !== null
        && ship.x <= a.x && a.x < ship.x + ship.width
        && ship.y <= a.y && a.y < ship.y + ship.height
      ) this.ship = null;
    }
  }

  this.draw = (drawCtx) =>
  { drawCtx.clearRect(0,0,640,480);

    if(this.ship !== null)
    { var ship = this.ship;
      drawCtx.drawImage(ship.image, ship.x, ship.y, ship.width, ship.height);
    }

    this.asteroids.forEach(a =>
    { if(a !== null) drawCtx.fillRect(a.x-2,a.y-2,5,5);
    });

    drawCtx.strokeRect(0,0,640,480);
  }
}

function main()
{ var drawCtx = document.getElementById("canv").getContext("2d");

  var gd = new GameData();

  window.addEventListener("keydown", (ev) =>
  { if(ev.code == "ArrowRight") gd.inputX=1;
    else if(ev.code == "ArrowLeft") gd.inputX=-1;
    else if(ev.code == "ArrowDown") gd.inputY=1;
    else if(ev.code == "ArrowUp") gd.inputY=-1;
  });

  window.addEventListener("keyup", (ev) =>
  { if(ev.code == "ArrowRight" && 0 < gd.inputX) gd.inputX=0;
    else if(ev.code == "ArrowLeft" && gd.inputX < 0) gd.inputX=0;
    else if(ev.code == "ArrowDown" && 0 < gd.inputY) gd.inputY=0;
    else if(ev.code == "ArrowUp" && gd.inputY < 0) gd.inputY=0;
  });

  scoreField = document.getElementById("score");
  setInterval(()=>
  { gd.step();
    gd.draw(drawCtx);
    scoreField.textContent = "pisteet: " + gd.score +
      (gd.ship === null? ", peli ohi, päivitä sivu uusintapeliä varten": "");
  }, 40);
}

if (document.readyState === 'loading')
{ document.addEventListener('DOMContentLoaded', ev => main());
} else main();
