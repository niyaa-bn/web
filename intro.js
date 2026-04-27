window.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro-screen");
  const canvas = document.getElementById("intro-stars");
  const fill = document.getElementById("intro-progress-fill");
  const percentText = document.getElementById("intro-percent");

  if (!intro || !canvas || !fill || !percentText) return;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let centerX = 0;
  let centerY = 0;
  let stars = [];
  let warp = false;

  const colors = [
    "255,255,255",  // trắng
    "180,220,255",  // xanh nhạt
    "255,200,220",  // hồng
    "255,240,180",  // vàng
    "200,255,220"   // xanh lá nhạt
  ];

  function resizeIntroCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    centerX = width / 2;
    centerY = height / 2;
    createStars();
  }

  function createStars() {
    stars = [];
    const count = Math.min(600, Math.floor((width * height) / 3500));

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * Math.max(width, height);
      const color = colors[Math.floor(Math.random() * colors.length)];

      stars.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        size: Math.random() * 1.6 + 0.4,
        speed: Math.random() * 0.5 + 0.2,
        alpha: Math.random() * 0.7 + 0.25,
        color: color
      });
    }
  }

  function drawStars() {
    ctx.clearRect(0, 0, width, height);

    for (const star of stars) {
      const dx = star.x - centerX;
      const dy = star.y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const nx = dx / dist;
      const ny = dy / dist;
      const speed = warp ? star.speed * 28 : star.speed;
      const tail = warp ? Math.min(90, dist * 0.12) : 0;

      if (warp) {
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - nx * tail, star.y - ny * tail);
        ctx.strokeStyle = `rgba(${star.color},${star.alpha})`;
        ctx.lineWidth = star.size;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgb(${star.color})`;
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color},${star.alpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgb(${star.color})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      star.x += nx * speed;
      star.y += ny * speed;

      if (
        star.x < -120 ||
        star.x > width + 120 ||
        star.y < -120 ||
        star.y > height + 120
      ) {
        star.x = centerX + (Math.random() - 0.5) * 40;
        star.y = centerY + (Math.random() - 0.5) * 40;
        star.color = colors[Math.floor(Math.random() * colors.length)];
      }
    }

    requestAnimationFrame(drawStars);
  }

  function runProgress() {
    const durationMs = 4000;
    const start = performance.now();

    function step(now) {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.floor(eased * 100);

      fill.style.width = value + "%";
      percentText.textContent = value + "%";

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        startWarp();
      }
    }

    requestAnimationFrame(step);
  }

  function startWarp() {
    warp = true;
    intro.classList.add("warp");

    setTimeout(() => {
      intro.classList.add("hide");
      document.body.classList.remove("intro-active");
    }, 1800);

    setTimeout(() => {
      intro.remove();
    }, 2800);
  }

  resizeIntroCanvas();
  drawStars();
  runProgress();

  window.addEventListener("resize", resizeIntroCanvas);
});