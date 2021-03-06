import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';
const { date, array, utils } = ham;
ham.help('in text.js')

// textNode
export default class {
  constructor(textNode = document.createElementNS('http://www.w3.org/2000/svg', 'text'), parent) {
    this.parent = parent
    this.element = textNode;
    this.element.nodeValue = 'poop';
    console.log('this.parent ', this.parent)
    // this.element.setAttributeNS(null, 'text-anchor', 'middle');
    this.element.classList.add('text-node'); //to make div fit text

    this.positionIndex = [...this.parent.element.children].indexOf(this.element)

    this._textValue = this.element.nodeValue;
    this._editMode = false;

    this.textWrapper = null; // = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
    this.textEditor = null; // = document.createElement("div")=null;
    this.text = null; // = document.createtext(text);


  };

  editText(text) {
    // this.element.setAttribute('display', 'none')
    // this.parent.element.removeChild(this.element)
    // this.parent.element.removeChild(this.element)
    console.log('this.parent 5', this.element)
    this.textValue = 'fuck'
    console.log('this.parent 7', this.element)
    this.textWrapper = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
    this.textEditor = document.createElement("div");
    this.text = document.createTextNode(text);

    this.textEditor.appendChild(this.text);
    this.textEditor.setAttribute("contentEditable", "true");
    this.textEditor.setAttribute("width", "auto");

    this.textWrapper.setAttribute("width", "100%");
    this.textWrapper.setAttribute("height", "100%");
    this.textWrapper.classList.add("node-text-editor-wrapper"); //to make div fit text

    this.textEditor.classList.add('node-text-editor'); //to make div fit text
    // this.textEditor.onblur = this.editAccept.bind(this);

    this.textWrapper.setAttributeNS(null, "transform", `translate(${this.parent.centroid.x} ${this.parent.centroid.y})`)
    this.textWrapper.appendChild(this.textEditor)

    ham.event.selectAllContent(this.textEditor)
    this.parent.element.appendChild(this.textWrapper);
  
    this.textEditor.click()
    this.textEditor.focus()

  }

  editAccept() {
    console.log('edit');
    console.log('this.parent.element.children[this.positionIndex -1]', this.parent.element.children)
    this.textEditor.onblur = null;
    // this.parent.element.insertBefore(this.element, this.parent.element.children[this.positionIndex -1])
    // this.parent.element.appendChild(this.element)
    this.element.nodeValue = this.textEditor.innerText;
    this.element.setAttribute('display', 'inline-block')

    this.textValue = this.textEditor.innerText;
    // this.text = null;
    // this.textEditor = null;
    this.textWrapper.remove()
    // this.textWrapper = null;

    // this.element.style.display = 'inline-block'

  }
  editCancel() {
    console.log('cancel');
    this.textEditor.onblur = null;
    this.text = null;
    this.textEditor = null;
    this.textWrapper.remove()
    this.textWrapper = null;
    // this.parent.element.insertBefore(this.element, this.parent.element.children[this.positionIndex])
    // this.element.style.display = 'inline-block'
    this.element.childNodes[0].nodeValue = textdiv.innerText;
    this.element.setAttribute('display', 'inline-block')

  }


  get editMode() { return this._editMode };
  set editMode(newValue) {
    this._editMode = newValue
    if (this.editMode === true) {
      this.editText(this.textValue || 'Text here...')
    }
    else {

    }
  };

  get textValue() { return this._textValue };
  set textValue(newValue) {
    console.log('newValue', newValue);
    this._textValue = newValue
    this.element.nodeValue = newValue;
    // this.element.childNodes[0].nodeValue = this.textValue;
  };
}





// window.edittext = function(localpoint, svg, textNode, text) {
//   if (textNode) {
//     textNode.setAttribute('display', 'none');
//   }
//   var myforeign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
//   var textdiv = document.createElement("div");
//   text = text || "type on me";
//   var textnode = document.createTextNode(text);


//   textdiv.appendChild(textnode);
//   textdiv.setAttribute("contentEditable", "true");
//   textdiv.setAttribute("width", "auto");

//   myforeign.setAttribute("width", "100%");
//   myforeign.setAttribute("height", "100%");
//   myforeign.classList.add("foreign2"); //to make div fit text

//   textdiv.classList.add("insideforeign2"); //to make div fit text
//   myforeign.setAttributeNS(null, "transform", "translate(" + localpoint.x + " " + localpoint.y + ")");
//   // node append
//   svg.appendChild(myforeign);
//   myforeign.appendChild(textdiv);

//   //selwct all
//   // var range = document.createRange();
//   // range.selectNodeContents(textdiv);
//   // var sel = window.getSelection();
//   // sel.removeAllRanges();
//   // sel.addRange(range);

//   ham.event.selectAllContent(textdiv)
//   textdiv.click()


//   function accept() {
//     if (textdiv.innerText.length) {
//       // TEST IF TEXTNODE EXISTS, IF SO MAKE ITS VALUE === TEXT EDITOR DIV VALUE
//       if (textNode) {
//         textNode.childNodes[0].nodeValue = textdiv.innerText;
//         textNode.setAttribute('display', 'inline-block')
//       } else {
//         // IF NO TEXTNODE, CREATE ONE
//         // NOTE: DONT NEED THIS PART??
//         var svgtext = document.createElementNS('http://www.w3.org/2000/svg', 'text');
//         svgtext.appendChild(document.createTextNode(textdiv.innerText));
//         svgtext.setAttribute("x", localpoint.x);
//         svgtext.setAttribute("y", localpoint.y);
//         svg.appendChild(svgtext);
//       }
//     } else if (textNode) {
//       console.log('textNode', textNode)
//       textNode.remove();
//     }
//     textdiv.onblur = null;
//     myforeign.remove()
//   }

//   function cancel() {
//     if (textNode) {
//       textNode.setAttribute('display', 'inline-block')
//     }
//     textdiv.onblur = null;
//     myforeign.remove()
//   }

//   textdiv.onkeydown = function(event) {
//     event.stopPropagation();

//     if (event.keyCode === 13) {
//       accept();
//     } else if (event.keyCode === 27) {
//       cancel();
//     }
//   }
//   textdiv.onblur = cancel;

//   textdiv.focus();
// };

// var svg = document.getElementById('thesvg2');
// // $('#thesvg').click(function(evt) {
// document.getElementById('thesvg2').addEventListener('click', function(evt) {
//   var localpoint, text, textNode;
//   // console.log('textNode',textNode)
//   if (evt.target.tagName === 'text') {
//     textNode = evt.target;
//     console.log('textNode', textNode)
//     localpoint = { x: textNode.getAttribute("x"), y: textNode.getAttribute("y") };
//     text = textNode.childNodes[0].nodeValue;
//   } else if (evt.target.tagName === 'svg') {
//     text = null;
//     localpoint = getlocalmousecoord(svg, evt);
//   }
//   else return;
//   edittext(localpoint, svg, textNode, text);
// });



// // DONT NEED
// window.getlocalmousecoord = function(svg, evt) {
//   var pt = svg.createSVGPoint();
//   pt.x = evt.clientX;
//   pt.y = evt.clientY;
//   var localpoint = pt.matrixTransform(svg.getScreenCTM().inverse());
//   localpoint.x = Math.round(localpoint.x);
//   localpoint.y = Math.round(localpoint.y);
//   return localpoint;
// };

