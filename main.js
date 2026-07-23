window.addEventListener("load", function() {
  const width = 480;
  const height = 640;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.style.display = "block";
  canvas.style.margin = "0 auto";
  document.body.style.margin = "0";
  document.body.style.background = "#70c5ce";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  const bird = {
    x: 80,
    y: height / 2,
    radius: 14,
    velocity: 0,
    gravity: 0.55,
    lift: -10,
    rotation: 0
  };

  const pipes = [];
  const pipeGap = 150;
  const pipeWidth = 55;
  let frames = 0;
  let score = 0;
  let bestScore = 0;
  let gameState = "start";

  function resetGame() {
    bird.y = height / 2;
    bird.velocity = 0;
    bird.rotation = 0;
    pipes.length = 0;
    frames = 0;
    score = 0;
    gameState = "start";
  }

  function spawnPipe() {
    const topHeight = 80 + Math.random() * (height - pipeGap - 160);
    pipes.push({
      x: width,
      top: topHeight,
      bottom: topHeight + pipeGap,
      passed: false
    });
  }

  function flap() {
    if (gameState === "start") {
      gameState = "playing";
    }
    if (gameState === "playing") {
      bird.velocity = bird.lift;
    }
    if (gameState === "gameover") {
      resetGame();
    }
  }

  function update() {
    if (gameState !== "playing") {
      return;
    }

    frames += 1;
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    bird.rotation = Math.max(-1.2, Math.min(1.2, bird.velocity / 15));

    if (frames % 90 === 0) {
      spawnPipe();
    }

    for (let i = pipes.length - 1; i >= 0; i -= 1) {
      const pipe = pipes[i];
      pipe.x -= 2.8;

      if (!pipe.passed && pipe.x + pipeWidth < bird.x) {
        pipe.passed = true;
        score += 1;
      }

      if (pipe.x + pipeWidth < 0) {
        pipes.splice(i, 1);
        continue;
      }

      const hitTop = bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeWidth && bird.y - bird.radius < pipe.top;
      const hitBottom = bird.x + bird.radius > pipe.x && bird.x - bird.radius < pipe.x + pipeWidth && bird.y + bird.radius > pipe.bottom;
      if (hitTop || hitBottom) {
        gameState = "gameover";
      }
    }

    if (bird.y + bird.radius >= height) {
      bird.y = height - bird.radius;
      gameState = "gameover";
    }
    if (bird.y - bird.radius <= 0) {
      bird.y = bird.radius;
      bird.velocity = 0;
    }

    if (gameState === "gameover") {
      bestScore = Math.max(bestScore, score);
    }
  }

  function drawBackground() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, width, height);
  }

  function drawPipe(pipe) {
    ctx.fillStyle = "#4ec0ca";
    ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, height - pipe.bottom);

    ctx.fillStyle = "#2f9aa7";
    ctx.fillRect(pipe.x + 8, pipe.top - 20, pipeWidth - 16, 20);
    ctx.fillRect(pipe.x + 8, pipe.bottom, pipeWidth - 16, 20);
  }

  function drawBird() {
    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate(bird.rotation);
    ctx.fillStyle = "#ffdd59";
    ctx.beginPath();
    ctx.arc(0, 0, bird.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(5, -6, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#282828";
    ctx.beginPath();
    ctx.arc(6, -6, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawText() {
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText(score, width / 2, 80);

    ctx.font = "18px Arial";
    if (gameState === "start") {
      ctx.fillText("Click or press space to start", width / 2, height / 2 - 20);
    }
    if (gameState === "gameover") {
      ctx.fillText("Game Over", width / 2, height / 2 - 40);
      ctx.fillText("Click or press space to restart", width / 2, height / 2);
      ctx.fillText("Best: " + bestScore, width / 2, height / 2 + 40);
    }
  }

  function draw() {
    drawBackground();
    pipes.forEach(drawPipe);
    drawBird();
    drawText();
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  window.addEventListener("mousedown", function(event) {
    flap();
  });

  window.addEventListener("keydown", function(event) {
    if (event.code === "Space") {
      event.preventDefault();
      flap();
    }
  });

  resetGame();
  loop();
});