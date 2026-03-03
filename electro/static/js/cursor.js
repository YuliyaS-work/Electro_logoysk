// ── CURSOR ──
const cur = document.getElementById('cur');

cur.style.cssText = `
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-2px, -2px);
`;

cur.innerHTML = `
  <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
    <path d="M1 1L1 18L5.5 13.5L8 21L10.5 20L8 12.5L14 12.5L1 1Z"
      stroke="#FF8D3F" stroke-width="1" stroke-linejoin="round" fill="none"/>
  </svg>`;

document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
});
