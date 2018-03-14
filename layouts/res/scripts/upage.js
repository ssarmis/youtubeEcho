'use strict';


let vis;
let alreadyUp = false;
let currentId = false;
let currentList = new Array();
let isTouchDevice = 'ontouchstart' in document.documentElement;

$('#player-container').hide();

function startVis(id){
  if(currentId === id){
    return;
  }
  
  currentId = id;

  $.get(`/reqsgl?id=${id}`, data => {
    currentList = data.items.slice();

    let opt = {
        src: `http://192.168.0.134:3000/music?id=${currentList[0].id}`,
        coloru: '#ff0000',
        colorm: '#770077',
        colord: '#770022'
    };

    if(vis !== undefined){
      vis.pause();
      vis.close();
    }

    if(!alreadyUp){
      $('#player-container').slideDown('fast', function() {
        vis = new visualizer(opt);
        vis.play();
        alreadyUp = !alreadyUp;
      });
    } else {
        vis = new visualizer(opt);
        vis.play();
    }
  });
}

$.get('/reqpl', data => {
  data.items.forEach(item => {
    let allowed = 30;
    let title = item.title.substring(0, allowed - 3);
    if(item.title.length > allowed - 3){
      title += '...';
    }
    
    let cclk = isTouchDevice ? 
      `ontouchend="startVis('${item.id}')"`:
      `onclick="startVis('${item.id}')"`
    
    $('#main-container').append(`
      <div class="pl-container">
        <h2>${title}</h2><br>
        <div class='pl-btn-date'>
          <i class="fas fa-play-circle" 
          ${cclk}
          ></i>
        </div>

        <div class='pl-detail-date'>
          <h4>${item.last_updated}</h4>
        </div>
      </div>
      `)
  });
});
