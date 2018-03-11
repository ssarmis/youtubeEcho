var working = false;
$('.login').on('submit', function(e) {
  e.preventDefault();

  if (working){
    return;
  } 

  working = true;

  let $this = $(this);
  let $state = $this.find('button > .state');

  $this.addClass('loading');
  $state.html('Authenticating');
  $("#login-spinner").append("<i id='spinner'></i>")

  setTimeout(() => {
    $this.addClass('ok');
    $state.html('Welcome back!');
  }, 3000);
});