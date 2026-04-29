<template>
  <div class="glowing-book-container">
    <div class="book-wrapper">
      <div class="book">
        <div class="side front"></div>
        <div class="side back"></div>
        <div class="side left"></div>
        <div class="side right"></div>
        <div class="side top"></div>
        <div class="side bottom"></div>
        
        <div class="pages">
          <div v-for="i in 5" :key="i" class="page" :style="`--i: ${i}`">
            <div class="page-content">
              <div class="script-text">
                <p v-if="i % 2 === 0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <p v-else>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <div class="decorative-line"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="glow-effect"></div>
    </div>
  </div>
</template>

<style scoped>
.glowing-book-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1500px;
  background: transparent;
  pointer-events: none;
  opacity: 0.15; /* Keep it subtle as a background */
}

.book-wrapper {
  position: relative;
  width: 200px;
  height: 280px;
  transform-style: preserve-3d;
  animation: floatBook 6s ease-in-out infinite;
}

.book {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transform: rotateX(25deg) rotateY(-20deg);
  animation: openClose 12s ease-in-out infinite;
}

.side {
  position: absolute;
  background: #2d2016;
  border: 1px solid rgba(194, 168, 122, 0.3);
}

.front { width: 100%; height: 100%; transform: translateZ(10px); background: #3d2b1d; border-radius: 0 4px 4px 0; }
.back  { width: 100%; height: 100%; transform: translateZ(-10px) rotateY(180deg); border-radius: 4px 0 0 4px; }
.left  { width: 20px; height: 100%; transform: translateX(-10px) rotateY(-90deg); background: #1a1208; }
.right { width: 20px; height: 100%; transform: translateX(190px) rotateY(90deg); }
.top   { width: 100%; height: 20px; transform: translateY(-10px) rotateX(90deg); }
.bottom{ width: 100%; height: 20px; transform: translateY(270px) rotateX(-90deg); }

.pages {
  position: absolute;
  top: 5px;
  left: 10px;
  width: 185px;
  height: 270px;
  transform-style: preserve-3d;
}

.page {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #fdfaf5;
  transform-origin: left;
  transform-style: preserve-3d;
  animation: flipPage 12s infinite;
  animation-delay: calc(var(--i) * 0.4s);
  box-shadow: inset 3px 0 10px rgba(0,0,0,0.1);
  display: flex;
  padding: 20px;
  box-sizing: border-box;
}

.page-content {
  width: 100%;
  height: 100%;
  border: 1px solid rgba(194, 168, 122, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.script-text {
  font-family: 'Georgia', serif;
  font-size: 8px;
  line-height: 1.6;
  color: #7c5533;
  font-style: italic;
  text-align: justify;
  animation: fadeInOut 12s infinite;
  animation-delay: calc(var(--i) * 0.4s);
}

.decorative-line {
  width: 40px;
  height: 1px;
  background: #c2a87a;
  margin: 10px auto;
  opacity: 0.5;
}

.glow-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 400px;
  background: radial-gradient(circle, rgba(194, 168, 122, 0.3) 0%, transparent 70%);
  filter: blur(20px);
  z-index: -1;
  animation: pulseGlow 4s ease-in-out infinite;
}

@keyframes floatBook {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes openClose {
  0%, 100% { transform: rotateX(25deg) rotateY(-20deg); }
  30%, 70% { transform: rotateX(25deg) rotateY(-50deg) scale(1.1); }
}

@keyframes flipPage {
  0%, 20% { transform: rotateY(0deg); }
  40%, 60% { transform: rotateY(-160deg); }
  80%, 100% { transform: rotateY(0deg); }
}

@keyframes fadeInOut {
  0%, 20%, 80%, 100% { opacity: 0; }
  40%, 60% { opacity: 0.6; }
}

@keyframes pulseGlow {
  0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
}
</style>
