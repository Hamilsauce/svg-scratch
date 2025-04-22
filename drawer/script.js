const drawerTemplate = (html) => {
  const template = document.createElement('template');
  template.innerHTML = html ? html : `<div class="drawer" id="drawer">
      <div class="drawer-handle" data-expanded="false" id="drawer-handle">
        <svg height="24px" width="24px" viewBox="0 0 20 20" fill="#FFFFFF" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M20 9H4v2h16V9zM4 15h16v-2H4v2z" />
        </svg>
      </div>
      <div id="options"></div>
    </div>`;
  
  const nNodes = template.content.childNodes.length;
  
  return template.content.firstChild;
}

const defaultOptions = [
{
  value: 'set-time',
  content: 'Set Time',
},
{
  value: 'practice',
  content: 'Timing Practice',
},
{
  value: 'record',
  content: 'Record',
},
{
  value: 'play',
  content: 'Play',
},
{
  value: 'save',
  content: 'Save',
}, ]

export class Drawer {
  constructor(parentSelector = '#app', options = defaultOptions) {
    this.parent = document.querySelector(parentSelector);
    
    // this.drawer = document.querySelector('#drawer-template').content.firstElementChild.cloneNode(true) || document.createElement('div')
    this.drawer = drawerTemplate();
    
    this.handle = this.drawer.querySelector('.drawer-handle');
    this.init.bind(this)(options);
  }
  
  get self() { return this.drawer }
  
  get optionsList() { return this.self.querySelector('#options') }
  
  get optionItems() { return [...this.optionsList.querySelector('.drawer-option')] }
  
  get currentDrawerHeight() {
    return parseInt(getComputedStyle(this.drawer).height)
  }
  
  init(options = defaultOptions) {
    this.parent.appendChild(this.drawer)
    
    options.forEach(this.addOptionItem.bind(this));
    
    this.handle.addEventListener('dblclick', this.doubleClickDrawerHandle.bind(this));
    
    this.parent.addEventListener('click', e => {
      const pathContains = [...e.composedPath()].some(_ => _ === this.drawer)
      
      if (!pathContains) {
        this.drawer.style.transition = '0.6s ease-in-out';
        this.drawer.style.height = `${136}px`;
        this.drawer.dataset.expanded = 'false';
        setTimeout(() => this.drawer.style.transition = '', 600)
      }
    });
    
    this.handle.addEventListener('pointerdown', this.startDrag.bind(this));
    
    document.addEventListener('pointerdown', this.startDrag.bind(this));
  }
  
  addOptionItem({ value, content }) {
    const option = drawerTemplate(`<div data-value="value" class="drawer-option">${content}</div>`);
    this.optionsList.append(option)
  }
  
  isHandleEventSource(e) {
    return [...e.composedPath()].some(el => el === this.handle)
  }
  
  startDrag(e) {
    if (this.isHandleEventSource(e)) {
      
      this.handle.classList.add('pressed');
      
      this.handle.addEventListener('touchmove', this.dragDrawer.bind(this), true)
      this.handle.addEventListener('touchend', this.stopDrag.bind(this), true)
      e.preventDefault();
    } else return;
  }
  
  stopDrag(e) {
    this.handle.classList.remove('pressed')
    this.drawer.removeEventListener('touchmove', this.dragDrawer.bind(this), true)
    this.drawer.removeEventListener('touchend', this.stopDrag.bind(this), true)
  }
  
  dragDrawer(e) {
    const currentHeight = parseInt(getComputedStyle(this.drawer).height)
    const maxHeight = 450;
    const appHeight = parseInt(getComputedStyle(document.body).height)
    const touch = e.changedTouches[0].pageY - 10;
    
    if ((touch > (appHeight - 100))) return;
    else if (touch <= (appHeight - maxHeight)) this.drawer.style.height = `${this.currentDrawerHeight}px`;
    else this.drawer.style.height = `${(appHeight - touch)}px`;
  }
  
  doubleClickDrawerHandle(e) {
    if (this.drawer.dataset.expanded === 'true') {
      this.drawer.style.height = `${100}px`;
      this.drawer.dataset.expanded = 'false';
    } else {
      this.drawer.style.height = `${425}px`;
      this.drawer.dataset.expanded = 'true';
    }
  }
  
  toggleDrawerTransitionCSS() {
    this.drawer.style.transition = '0.6s ease-in-out';
    setTimeout(() => this.drawer.style.transition = '', 600)
  }
  
  handleClick(e) {
    this.drawer.dispatch(new CustomEvent('draw-clicked'))
  }
}