import App from './components/App.js';
import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js'
const { DOM } = ham

window.onload = () => {
  window.app = new App(document.getElementById('graph'));
};
