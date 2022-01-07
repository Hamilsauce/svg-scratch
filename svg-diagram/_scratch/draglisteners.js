let sel = null;
const onPointerDown = e => {
  const draggables = document.querySelectorAll('.draggable');
  draggables.forEach((el, i) => {
    el.classList.remove('draggable')
  });

  document.addEventListener('pointermove', onPointerMove);
  document.addEventListener('pointerup', onPointerUp);

  sel = e.target
  e.target.classList.add('draggable', 'sel')
  makeDraggable.byClassName('draggable');
  
}

const onPointerMove = e => {
}

const onPointerUp = e => {
  const draggables = document.querySelectorAll('.draggable');
  console.log('draggables', draggables)
  draggables.forEach((el, i) => {
    el.classList.remove('draggable')
  });

  sel.classList.remove('draggable', 'sel')
  sel = null;
  document.removeEventListener('pointermove', onPointerMove);
  document.removeEventListener('pointerup', onPointerUp);

}

document.addEventListener('pointerdown', onPointerDown);