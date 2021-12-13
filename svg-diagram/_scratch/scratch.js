class Eventer extends EventTarget{
  constructor() {
  super()
    this.root;
  }
  isComplete() {
    this.dispatchEvent(this.complete)
  }
  _complete = new CustomEvent('complete', { bubbles: true, detail: { data: 'data' } })
  get complete() { return this._complete };
  set complete(newValue) { this._complete = newValue };
}




const app = document.querySelector('.app');
const eventer = new Eventer()
const eventer2 = new Eventer()

app.handleComplete = (e) => {
  console.log('heard complete in app', e)
  
} 
app.addEventListener('complete', e => {
  console.log('heard complete in app', e)
});
eventer.addEventListener('complete', e => {
  console.log('heard complete in eventer', e)
});
eventer.addEventListener('complete',app.handleComplete);
eventer2.addEventListener('complete', e => {
  console.log('heard complete in eventer', e)
});

eventer.isComplete()

app.classList2 = function(keyword, ...classes) {
  if (classes.length === 0 || !keyword) return;
  this.classList[keyword](...classes)

}


const classList = (keyword, ...classes) => {
  if (classes.length === 0 || !keyword) return;
  this.rect.classList[keyword](...classes)

}

// const footerButtons = document.querySelectorAll('.app-body')
// const footer = document.querySelector('.container')

app.classList2('add', 'poop', 'whores', 'cool')
// console.log(app);
// app.classList2('remove', 'poop', 'cool')
// console.log(app);