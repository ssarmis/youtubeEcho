'use strict';

let alreadyUp = false;
let currentId = false;
let currentList = new Array();
let vis;

$('#player-container').hide();

function startVis(id){
  if(currentId === id){
    return;
  }
  
  currentId = id;

  $.get(`/reqsgl?id=${id}`, data => {
    currentList = data.items.slice();

    let opt = {
        src: `http://localhost:3000/music?id=${currentList[0].id}`,
        coloru: '#ff0000',
        colorm: '#770077',
        colord: '#770022'
    };

    if(vis !== undefined){
      vis.close();
    }

    vis = new visualizer(opt);

    if(!alreadyUp){
      $('#player-container').slideDown('fast', function() {
        vis.onlyVisualize();
        //vis.play();
        alreadyUp = !alreadyUp;
      });
    } else {
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

    
    $('#main-container').append(`
      <div class="pl-container">
        <h2>${title}</h2><br>
        <div class='pl-btn-date'>
          <i class="fas fa-play-circle" onclick="startVis('${item.id}')"></i>
        </div>

        <div class='pl-detail-date'>
          <h4>${item.last_updated}</h4>
        </div>
      </div>
      `)
  });
});
