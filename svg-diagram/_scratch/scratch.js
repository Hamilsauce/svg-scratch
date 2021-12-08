  const app = document.querySelector('.app');
  app.classList2 = function (keyword, ...classes) {
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
  console.log(app);
  // app.classList2('remove', 'poop', 'cool')
  console.log(app);