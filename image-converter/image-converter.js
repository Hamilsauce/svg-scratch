let droppedFiles = false;
let drop = document.getElementById("dropzone");
let tostop = ["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"];
for (let i in tostop) {
  drop.addEventListener(tostop[i], function (e) {
    e.preventDefault();
    e.stopPropagation();
    e.originalEvent = e;
  });
}
tostop = ["dragover", "dragenter"];
for (let i in tostop) {
  drop.addEventListener(tostop[i], function (e) {
    document.getElementById("dropzone").classList.add("bg-light");
  });
}
tostop = ["dragleave", "dragend", "drop"];
for (let i in tostop) {
  drop.addEventListener(tostop[i], function (e) {
    document.getElementById("dropzone").classList.remove("bg-light");
  });
}
drop.addEventListener("drop", function (e) {
  console.log(e);
  document.getElementById("images").files = e.originalEvent.dataTransfer.files
});

window.convertto = 'png';
window.zip = null;
let JpgToPngConvertor = function () {
  function convertor(imageFileBlob, options) {
    options = options || {};
    const defaults = {
      downloadLinkSelector: '.js-download-' + window.convertto
    };
    const settings = extend(defaults, options);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext("2d");
    const imageEl = createImage();
    const downloadLink = settings.downloadEl || createDownloadLink();

    function createImage(options) {
      options = options || {};
      const img = (Image) ? new Image() : document.createElement('img');
      const parent = options.parentEl || document.body;
      img.style.width = (options.width) ? options.width + 'px' : 'auto';
      img.style.height = (options.height) ? options.height + 'px' : 'auto';
      return img;
    }

    function extend(target, source) {
      for (let propName in source) {
        if (source.hasOwnProperty(propName)) {
          target[propName] = source[propName];
        }
      }
      return target;
    }

    function createDownloadLink() {
      return document.createElement('a');
    }

    function isFirefox() {
      return navigator.userAgent.indexOf("Firefox") > -1;
    }

    function download(blob) {
      // Add download link to DOM in case it is not there and on the firefox
      if (!window.zip) {
        if (!document.contains(downloadLink) && isFirefox()) {
          downloadLink.style.display = 'none';
          document.body.appendChild(downloadLink);
        }
        if ('click' in downloadLink) {
          downloadLink.click();
        } else {
          downloadLink.dispatchEvent(createClickEvent());
        }
      } else {
        zip.file(document.getElementById("images").files[converted].name.substring(0,
          document.getElementById("images").files[converted].name.indexOf(".")) + "." + window.convertto, blob);
        converted++;
        if (converted == document.getElementById("images").files.length) {
          zip.generateAsync({
            type: "blob"
          }).then(function (content) {
            saveAs(content, "images.zip");
          });
        }
      }

    }

    function updateDownloadLink(jpgFileName, pngBlob) {
      console.log(jpgFileName);
      const linkEl = downloadLink;
      let pngFileName = "";
      if (document.getElementById("exampleFormControlSelect1").value.toLowerCase() == 'jpeg') {
        pngFileName = jpgFileName.replace(/jpe?g/i, window.convertto);
      } else {
        pngFileName = jpgFileName.replace(document.getElementById("exampleFormControlSelect1").value.toLowerCase(),
          window.convertto);
      }
      linkEl.setAttribute('download', pngFileName);
      linkEl.href = window.URL.createObjectURL(pngBlob);
      console.log(pngBlob);
      // If there is custom download link we don't download automatically
      if (settings.downloadEl) {
        settings.downloadEl.style.display = 'block';
      } else {
        download(pngBlob);
      }
    }

    function createClickEvent() {
      if ('MouseEvent' in window) {
        return new MouseEvent('click');
      } else {
        const evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window);
        return evt;
      }
    }

    function process() {
      const imageUrl = window.URL.createObjectURL(imageFileBlob);
      imageEl.onload = (e) => {
        canvas.width = e.target.width;
        canvas.height = e.target.height;
        ctx.drawImage(e.target, 0, 0, e.target.width, e.target.height);
        console.log('image/' + window.convertto);
        canvas.toBlob(updateDownloadLink.bind(window, imageFileBlob.name), 'image/' + window.convertto, 1);
      };
      imageEl.src = imageUrl;
      if (settings.downloadEl) {
        settings.downloadEl.style.display = 'none';
      }
    }
    return {
      process: process
    };
  }
  return convertor;
}
let conv = new JpgToPngConvertor();
let converted = 0;
window.convert = function () {
  converted = 0;

  window.convertto = document.getElementById("exampleFormControlSelect2").value.toLowerCase();
  console.log(window.convertto);
  if (!document.getElementById("tozip").checked) {
    window.zip = null;

    for (let i = 0; i < document.getElementById("images").files.length; i++) {
      conv(document.getElementById("images").files[i]).process();
    }
  } else {
    window.zip = new JSZip();
    for (let i = 0; i <
      document.getElementById("images").files.length; i++) {
      conv(document.getElementById("images").files[i]).process(zip);
    }
  }
}