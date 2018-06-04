'use strict';


let vis;
let addUp = false;
let alreadyUp = false;
let currentId = false;
let currentList = new Array();
let isTouchDevice = 'ontouchstart' in document.documentElement;

$('#add-container').hide();

function openAdd(){
  if(addUp) {
    $('#add-container').hide();    
    addUp = !addUp;
    return;
  }

  $('#add-container').slideDown("fast", function(){
    addUp = true;
  });  
}

function addSong(song){
  let cclk = isTouchDevice ? 
  `ontouchend='changePlay("${song.id}", "${song.title}")'`:
  `onclick='changePlay("${song.id}", "${song.title}")'`

  $('#tracks-ul').append(
    `<li><a href="#"
    ${cclk}>
    ${song.title}</a></li>`
  );
}

function changePlay(songId, songTitle){
  $('#song-title').html(`Now playing: ${songTitle}`);
  let opt = {
      src: `/music?id=${songId}`,
      coloru: '#ff0000',
      colorm: '#770077',
      colord: '#770022'
  };

  if(vis !== undefined){
    vis.pause();
    vis.close();
  }

  if(!alreadyUp){
      vis = new visualizer(opt);
      vis.play();
      alreadyUp = !alreadyUp;
  } else {
      vis = new visualizer(opt);
      vis.play();
  }
}

function startVis(id, title){
  if(currentId === id){
    return;
  }
  
  $('#tracks-ul').html('');
  $('#playlist-title').html(`${title}`);
  currentId = id;

  $.get(`/reqsgl?id=${id}`, data => {
    currentList = data.items.slice();
    currentList.forEach(song => addSong(song));

    let opt = {
        src: `/music?id=${currentList[0].id}`,
        coloru: '#ff0000',
        colorm: '#770077',
        colord: '#770022'
    };

    changePlay(currentList[0].id, currentList[0].title);
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
      `ontouchend='startVis("${item.id}", "${item.title}")'`:
      `onclick='startVis("${item.id}", "${item.title}")'`
    
    $('#playlists-holder').append(`
      <a href='#' class="pl-container" ${cclk}>
        <h2>${title}</h2><br>
        <div class='pl-detail-date'>
          <h4>${item.last_updated}</h4>
        </div>
      </a>
      `);
  });
});
