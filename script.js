function toggleTheme() {
  const body = document.body;
  const icon = document.querySelector('.toggle .icon');
  
  if (body.classList.contains('dark')) {
    body.classList.remove('dark');
    body.classList.add('light');
    icon.textContent = '🌙';
  } else {
    body.classList.remove('light');
    body.classList.add('dark');
    icon.textContent = '☀️';
  }
}