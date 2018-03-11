'use strict';

window.AudioContext = 
window.AudioContext || window.webkitAudioContext || 
window.mozAudioContext || window.msAudioContext;

function visualizer(src, color, scolor){

  this.ready = false;
  this.width = '100%';
  this.height = '100%';

  $('#vis-container').append(`<canvas id="vis-canvas" width="${this.width}" height="${this.height}"></canvas>`);

  this.canvas = document.getElementById('vis-canvas');
  this.ctx = this.canvas.getContext('2d');

  this.canvas.width = window.innerWidth;
  this.canvas.height = window.innerHeight;

  this.ctx.fillStyle = '#000000';
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  window.addEventListener('resize', () => {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  });

  this.audio = new Audio();
  this.audioPlay = new Audio();

  this.audio.src = src;
  this.audio.crossOrigin = "anonymous";

  this.audioPlay.src = this.audio.src;
  this.audioPlay.crossOrigin = "anonymous";

  if(window.AudioContext === undefined){
    console.error('No audio context was found.');
    return;
  }

  this.audioContext = new AudioContext();

  if(this.audioContext === undefined){
    console.error('Could not initialize audio context.');
    return;
  }

  this.audioSrc = this.audioContext.createMediaElementSource(this.audio);
  this.analyser = this.audioContext.createAnalyser();
  this.audioSrc.connect(this.analyser);

  this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);

  this.audioPlay.addEventListener('canplay', () => {
    $('#vis').append(this.audioPlay);
    this.ready = true;
  });


  this.play = () => {

    let refresher = setInterval(() => {
      if(this.ready) {
        this.audioPlay.play();
        this.audio.play();

        this.audio.currentTime = this.audioPlay.currentTime;
        this.draw();
        clearInterval(refresher);
      }
    }, 500);

  }

  this.draw = () => {
    if(this.canvas.width !== window.innerWidth){
      return;
    }

    if(this.canvas.height !== window.innerHeight){
      return;
    }

    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    requestAnimationFrame(this.draw);
    this.analyser.getByteFrequencyData(this.frequencyData);

    let half = window.innerWidth / 2;
    let freqOffset = 325;
    let size = half / (this.analyser.frequencyBinCount - freqOffset);
    let middle = this.canvas.height / 2 - 100;
    let midoff = 1;

    for (let i = 0; i < this.analyser.frequencyBinCount - freqOffset; ++i) {
      let freqValue = this.limitOnHeight(this.frequencyData[i]);

      this.ctx.fillStyle = color;
      this.ctx.fillRect(i * (size), middle - midoff - freqValue, (size - 0.5), freqValue);
      this.ctx.fillRect(half + (this.analyser.frequencyBinCount - 1 - i) * (size ) - size * freqOffset, middle - midoff - freqValue, (size - 0.5), freqValue);

      this.ctx.fillStyle = scolor;
      this.ctx.fillRect(i * (size), middle + midoff, (size - 0.5), freqValue);
      this.ctx.fillRect(half + (this.analyser.frequencyBinCount - 1 - i) * (size) - size * freqOffset, middle + midoff, (size - 0.5), freqValue);

    }
  }


  this.limitOnHeight = val => {
    return ((this.canvas.height / 3) * (val / 128));
  }
}

let vis = new visualizer('http://localhost:3000/music?id=5dznGsQmwuQ', '#ff0000', '#770022');

vis.play();