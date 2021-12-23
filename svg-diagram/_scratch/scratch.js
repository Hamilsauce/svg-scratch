const app = document.querySelector('.app');


class Eventer extends EventTarget {
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


const { from, race, interval, of , fromEvent, merge, empty, Subject } = rxjs;
const { bufferTime, reduce, bufferCount, bufferWhen, first, repeat, throttleTime, debounceTime, buffer, switchMap, concatMap, mergeMap, take, filter, scan, takeWhile, startWith, tap, map, mapTo } = rxjs.operators;

// const clicks = fromEvent(document, 'click');
// const clicks = merge(
//   fromEvent(app, 'click').pipe(
//     // throttleTime(400),
//     // filter(({ currentTarget }) => this.isEventSource(currentTarget)),
//     tap(e => e.preventDefault()),
//     map(evt => ({ type: evt.type, target: evt.currentTarget, event: evt })),
//   ),
//   fromEvent(app, 'dblclick').pipe(
//     // filter(({ currentTarget }, i) => this.isEventSource(currentTarget)),
//     tap(e => e.preventDefault()),
//     map(evt => ({ type: evt.type, target: evt.currentTarget, event: evt })),
//   ),
// )
const intervalEvents = interval(1000);

const buffered = intervalEvents.pipe(bufferWhen(() => clicks), tap(x => console.log('in bufferpipe)0', x), ));

// buffered.subscribe(x => console.log(x));

// RxJS v6+
// streams
const clicks$ = fromEvent(app, 'click');

/*
Collect clicks that occur, after 250ms emit array of clicks
*/
const dblclicks$ = clicks$
  .pipe(
    bufferTime(400),
    // bufferTime(clicks$.pipe(throttleTime(250))),
    // if array is greater than 1, double click occured
    filter(clickArray => clickArray.length > 1)
  )
  
  
  
  .subscribe(() => console.log('Double Click!'));


const clicks2$ = fromEvent(app, 'click').pipe(
  // throttleTime(600),
  tap(e => e.preventDefault()),
  // map(evt => ({ type: evt.type, target: evt.currentTarget, event: evt })),
)
const clickSub =
  // fromEvent(app, 'click')
  clicks2$.pipe(
    buffer(clicks$.pipe(throttleTime(7000))),
    // map(evts => evts[evts.length - 1]),
   
    map(buffered => {

      if (buffered.length === 1) {
        console.log('SINGLE CLICK');
      } else if (buffered.length > 1) {
        console.log('DOBULE CLICK');

      }
      return buffered
      
    }),
    map(buffered =>{
      console.log({ buffered });
      console.log(buffered.length);
      return buffered[buffered.length - 1];
      
    }),
    tap((e) => console.table('after buffer(clicks$', e)),
    // filter(clickArray => clickArray.length > 0),
    map(evt => ({ type: evt.type, target: evt.currentTarget, event: evt })),
  )
  // .subscribe()









const eventer = new Eventer()
const eventer2 = new Eventer()


// app.handleComplete = (e) => {
//   console.log('heard complete in app', e)

// } 
// app.addEventListener('complete', e => {
//   console.log('heard complete in app', e)
// });
// eventer.addEventListener('complete', e => {
//   console.log('heard complete in eventer', e)
// });
// eventer.addEventListener('complete',app.handleComplete);
// eventer2.addEventListener('complete', e => {
//   console.log('heard complete in eventer', e)
// });

// eventer.isComplete()

// app.classList2 = function(keyword, ...classes) {
//   if (classes.length === 0 || !keyword) return;
//   this.classList[keyword](...classes)

// }


// const classList = (keyword, ...classes) => {
//   if (classes.length === 0 || !keyword) return;
//   this.rect.classList[keyword](...classes)

// }

// // const footerButtons = document.querySelectorAll('.app-body')
// // const footer = document.querySelector('.container')

// app.classList2('add', 'poop', 'whores', 'cool')
// // console.log(app);
// // app.classList2('remove', 'poop', 'cool')
// // console.log(app);