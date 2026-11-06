const toggle = document.querySelector('.controls-toggle');
const panel = document.getElementById('scene-controls');
toggle.addEventListener('click', () => {
  panel.hidden = !panel.hidden;
  toggle.setAttribute('aria-expanded', String(!panel.hidden));
});
panel.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  }
});
