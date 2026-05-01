<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h4>Besoin d'aide ?</h4>
        <p>Contactez-nous pour toute question ou assistance</p>
        <button class="btn-contact">Contactez-nous</button>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© {{ currentYear }} Book Shop — ISIDS 26</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: #1a1a2e;
  color: #ccc;
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: center;
  padding: 2.5rem 2rem;
}

.footer-section {
  text-align: center;
}

.footer-section h4 {
  color: white;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.footer-section p {
  font-size: 0.85rem;
  margin-bottom: 1rem;
  color: #aaa;
}

.btn-contact {
  background: #2563a8;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
}

.btn-contact:hover {
  background: #1a4f8c;
}

.footer-bottom {
  border-top: 1px solid #333;
  text-align: center;
  padding: 1rem;
  font-size: 0.8rem;
  color: #666;
}
</style>
