document.querySelector('form').addEventListener('submit', e => {
  console.log(e.target);
  e.preventDefault();
  convert()
})