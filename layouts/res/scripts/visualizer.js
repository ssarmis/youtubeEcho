'use strict';

window.AudioContext = 
window.AudioContext || window.webkitAudioContext || 
window.mozAudioContext || window.msAudioContext;

/*

opt
  src
  coloru
  colord
  width
  height
*/

function visualizer(opt){

  this.ready = false;

  this.src = opt.src;

  this.coloru = opt.coloru === undefined ? 
    '#ff0000' :
    opt.coloru;

  this.colord = opt.colord === undefined ?
    '#770022' :
    opt.colord;

  if(this.src === undefined){
    console.error('No source was provided.');
    return;
  }


  $('#vis-container').append('<canvas id="vis-canvas"></canvas>');

  this.canvas = document.getElementById('vis-canvas');
  this.ctx = this.canvas.getContext('2d');

  $('#vis-container').css('display', 'block');
  $('#vis-container').width('100%');
  $('#vis-container').height('100%');

  $('#vis-canvas').css('display', 'block');
  $('#vis-canvas').width('100%');
  $('#vis-canvas').height('100%');

  this.canvas.width  = this.canvas.offsetWidth;
  this.canvas.height = this.canvas.offsetHeight;

  this.middle = this.canvas.height / 2;
  this.half = this.canvas.width / 2;

  window.addEventListener('resize', () => {

    $('#vis-container').width('100%');
    $('#vis-container').height('100%');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  
    this.middle = this.canvas.height / 2;
    this.half = this.canvas.width / 2;
  })

  this.ctx.fillStyle = '#000000';
  this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

  const freqOffset = 325;
  const midoff = 1;

  this.audio = new Audio();
  this.audioPlay = new Audio();

  this.audio.src = this.src;
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
    $('#vis-audio').append(this.audioPlay);
    this.ready = true;
  });


  this.play = () => {

    let refresher = setInterval(() => {
      if(this.ready) {
        this.audio.play();
        this.audioPlay.play();

        this.audio.currentTime = this.audioPlay.currentTime;
        this.draw();
        clearInterval(refresher);
      }
    }, 500);
  }


  this.pause = () => {
    this.audio.pause();
    this.audioPlay.pause();
    this.audio.currentTime = this.audioPlay.currentTime;
  }

  this.close = () => {
    this.audio.currentTime = 0;
    this.audio.pause();
    this.audio.load();
    this.audio.preload = 'none';
    this.audio.src = '';

    this.audioPlay.currentTime = 0;
    this.audioPlay.pause();
    this.audioPlay.load();
    this.audioPlay.preload = 'none';
    this.audioPlay.src = '';

    this.audioContext.close();
    $('#vis-audio').remove();
    $('#vis-canvas').remove();
  }

  this.onlyVisualize = () => {
    this.audio.play();
    this.draw();
  }

  this.draw = () => {
    
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    requestAnimationFrame(this.draw);
    this.analyser.getByteFrequencyData(this.frequencyData);

    let size = !this.isMobile() ? 
      this.half / (this.analyser.frequencyBinCount - freqOffset) :
      this.canvas.width / (this.analyser.frequencyBinCount - freqOffset);
    for (let i = 0; i < this.analyser.frequencyBinCount - freqOffset; ++i) {
      let freqValue = this.limitOnHeight(this.frequencyData[i]);

      this.ctx.fillStyle = this.mapColor(this.normalize(freqValue), this.percentColors);

      if(!this.isMobile()){
        this.ctx.fillRect(i * (size), this.middle - midoff - freqValue, (size - 0.5), freqValue);
        this.ctx.fillRect(this.half + (this.analyser.frequencyBinCount - 1 - i) * (size ) - size * freqOffset, this.middle - midoff - freqValue, (size - 0.5), freqValue);
        
        this.ctx.fillStyle = this.mapColor(this.normalize(freqValue), this.weakPercentColors);
        this.ctx.fillRect(i * (size), this.middle + midoff, (size - 0.5), freqValue);
        this.ctx.fillRect(this.half + (this.analyser.frequencyBinCount - 1 - i) * (size) - size * freqOffset, this.middle + midoff, (size - 0.5), freqValue);
      } else {
        this.ctx.fillRect(i * (size), 2 * this.middle - midoff - freqValue, (size), freqValue);
      }
    }
  }


  this.isMobile = () => {
     if(window.innerWidth <= 800 && window.innerHeight <= 600) {
       return true;
     } else {
       return false;
     }
  }

  this.limitOnHeight = val => {
    return ((this.canvas.height / 2) * (val / 256));
  }

  this.normalize = val => {
    return ((1) * (val / 256));
  }

  this.percentColors = [
    { pct: 0.0, color: { r: 0x00, g: 0x00, b: 0xff } },
    { pct: 0.5, color: { r: 0xff, g: 0x00, b: 0xff } },
    { pct: 1.0, color: { r: 0xff, g: 0x00, b: 0x00 } } ];

  this.weakPercentColors = [
    { pct: 0.0, color: { r: 0x00, g: 0x00, b: 0x77 } },
    { pct: 0.5, color: { r: 0x77, g: 0x00, b: 0x66 } },
    { pct: 1.0, color: { r: 0x77, g: 0x00, b: 0x00 } } ];

  this.mapColor = (pct, colors) => {
    for (var i = 1; i < colors.length - 1; ++i) {
        if (pct < colors[i].pct) {
            break;
        }
    }
    var lower = colors[i - 1];
    var upper = colors[i];
    var range = upper.pct - lower.pct;
    var rangePct = (pct - lower.pct) / range;
    var pctLower = 1 - rangePct;
    var pctUpper = rangePct;
    var color = {
        r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
        g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
        b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper)
    };
    return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
  }  
}
