//// ── CURSOR ──
//const cur = document.getElementById('cur');
//
//cur.style.cssText = `
//  position: fixed;
//  pointer-events: none;
//  z-index: 9999;
//  transform: translate(-2px, -2px);
//`;
//
//cur.innerHTML = `
//  <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
//    <path d="M1 1L1 18L5.5 13.5L8 21L10.5 20L8 12.5L14 12.5L1 1Z"
//      stroke="#FF8D3F" stroke-width="1" stroke-linejoin="round" fill="none"/>
//  </svg>`;
//
//document.addEventListener('mousemove', e => {
//  cur.style.left = e.clientX + 'px';
//  cur.style.top  = e.clientY + 'px';
//});
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
    <path id="cur-path" d="M1 1L1 18L5.5 13.5L8 21L10.5 20L8 12.5L14 12.5L1 1Z"
      stroke="#FF8D3F" stroke-width="1" stroke-linejoin="round" fill="none"
      style="transition: fill 0.15s ease;"/>
  </svg>`;

const curPath = cur.querySelector('#cur-path');

document.addEventListener('mousemove', e => {
  cur.style.left = e.clientX + 'px';
  cur.style.top  = e.clientY + 'px';
});

// Hover detection
document.addEventListener('mouseover', e => {
  if (e.target.closest('a, button, [role="button"], input, label, select, textarea, [tabindex], [onclick]')) {
    curPath.style.fill = '#756867';
  }
});

document.addEventListener('mouseout', e => {
  const el = e.target.closest('a, button, [role="button"], input, label, select, textarea, [tabindex], [onclick]');
  if (el && !el.contains(e.relatedTarget)) {
    curPath.style.fill = 'none';
  }
});
