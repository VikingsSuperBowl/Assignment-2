window.human = false;

var canvasEl = document.querySelector('.fireworks');
var ctx = canvasEl.getContext('2d');
var numberOfParticules = 30;
var colors = ['#800080', '#FFFF00', '#FFFFFF']; // Initial colors: Purple, Yellow, White
var shapes = ['circle', 'square', 'triangle']; // Possible shapes

function setCanvasSize() {
  canvasEl.width = window.innerWidth * 2;
  canvasEl.height = window.innerHeight * 2;
  canvasEl.style.width = window.innerWidth + 'px';
  canvasEl.style.height = window.innerHeight + 'px';
  canvasEl.getContext('2d').scale(2, 2);
}

function updateCoords(e) {
  pointerX = e.clientX || e.touches[0].clientX;
  pointerY = e.clientY || e.touches[0].clientY;
}

function setParticuleDirection(p) {
  var angle = anime.random(0, 360) * Math.PI / 180;
  var value = anime.random(50, 180);
  var radius = [-1, 1][anime.random(0, 1)] * value;
  return {
    x: p.x + radius * Math.cos(angle),
    y: p.y + radius * Math.sin(angle)
  }
}

function createParticule(x, y) {
  var p = {};
  p.x = x;
  p.y = y;
  p.color = colors[anime.random(0, colors.length - 1)]; // Randomly select a color from the array
  p.shape = shapes[anime.random(0, shapes.length - 1)]; // Randomly select a shape from the array
  p.radius = anime.random(20, 40); // Change the size range here
  p.endPos = setParticuleDirection(p);
  p.draw = function() {
    ctx.beginPath();
    if (p.shape === 'circle') {
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
    } else if (p.shape === 'square') {
      ctx.rect(p.x - p.radius / 2, p.y - p.radius / 2, p.radius, p.radius);
    } else if (p.shape === 'triangle') {
      ctx.moveTo(p.x, p.y - p.radius);
      ctx.lineTo(p.x + p.radius, p.y + p.radius);
      ctx.lineTo(p.x - p.radius, p.y + p.radius);
      ctx.closePath();
    }
    ctx.fillStyle = p.color;
    ctx.fill();
  };
  return p;
}

function createCircle(x, y) {
  var p = {};
  p.x = x;
  p.y = y;
  p.color = colors[anime.random(0, colors.length - 1)]; // Randomly select a color from the array
  p.radius = 0.1;
  p.alpha = .5;
  p.lineWidth = 6;
  p.draw = function() {
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
    ctx.lineWidth = p.lineWidth;
    ctx.strokeStyle = p.color;
    ctx.stroke();
    ctx.globalAlpha = 1;
  };
  return p;
}

function renderParticule(anim) {
  for (var i = 0; i < anim.animatables.length; i++) {
    anim.animatables[i].target.draw();
  }
}

function animateParticules(x, y) {
  var circle = createCircle(x, y);
  var particules = [];
  for (var i = 0; i < numberOfParticules; i++) {
    particules.push(createParticule(x, y));
  }
  anime.timeline().add({
    targets: particules,
    x: function(p) { return p.endPos.x; },
    y: function(p) { return p.endPos.y; },
    radius: 0.1,
    duration: anime.random(1200, 1800),
    easing: 'easeOutExpo',
    update: renderParticule
  })
    .add({
    targets: circle,
    radius: anime.random(80, 160),
    lineWidth: 0,
    alpha: {
      value: 0,
      easing: 'linear',
      duration: anime.random(600, 800),  
    },
    duration: anime.random(1200, 1800),
    easing: 'easeOutExpo',
    update: renderParticule,
    offset: 0
  });
}

var render = anime({
  duration: Infinity,
  update: function() {
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  }
});

function randomFireworks() {
  var x = anime.random(0, window.innerWidth);
  var y = anime.random(0, window.innerHeight);
  animateParticules(x, y);
  setTimeout(randomFireworks, anime.random(500, 1500)); // Adjust the interval as needed
}

document.addEventListener('mousedown', function(e) {
  window.human = true;
  render.play();
  updateCoords(e);
  animateParticules(pointerX, pointerY);
}, false);

document.getElementById('fireworksButton').addEventListener('click', function() {
  var x = anime.random(0, window.innerWidth);
  var y = anime.random(0, window.innerHeight);
  animateParticules(x, y);
});

document.getElementById('changeColorButton').addEventListener('click', function() {
  colors = Array.from({ length: 3 }, () => `#${Math.floor(Math.random() * 16777215).toString(16)}`);
});

document.getElementById('changeShapeButton').addEventListener('click', function() {
  shapes = ['circle', 'square', 'triangle']; // Reset shapes array to ensure randomness
});

randomFireworks();
setCanvasSize();
window.addEventListener('resize', setCanvasSize, false);