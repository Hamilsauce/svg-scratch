    if (
      navigator.userAgent != null &&
      navigator.userAgent.toLowerCase().indexOf(' electron/') >= 0 &&
      typeof process !== 'undefined' &&
      process.versions.electron < 5
    ) {
      // Redirects old Electron app to latest version
      var div = document.getElementById('geInfo');

      if (div != null) {
        div.innerHTML = '<center><h2>You are using an out of date version of this app.<br>Please download the latest version ' +
          '<a href="https://github.com/jgraph/drawio-desktop/releases/latest" target="_blank">here</a>.</h2></center>';
      }
    } else {
      if (urlParams['dev'] != '1' && typeof document.createElement('canvas').getContext === "function") {
        window.addEventListener('load', function() {
          mxWinLoaded = true;
          checkAllLoaded();
        });
      } else {
        App.main();
      }
    }