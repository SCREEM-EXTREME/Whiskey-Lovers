 $(document).ready(function(){
  //defining the request
  // var request = {
  //   type: 'GET',
  //   url: 'http://localhost:3000/KennethChan',
  //   success: function(response) {
  //     console.log(response);
  //   }
  // };
  
  //signing in
  // $.ajax(request);

  $('#bBoard').hide();

  $(document).on('click', "#signinBtn", function(event) {
    event.preventDefault();

    var psw = $("#InputPassword1").val();
    var username = $("#InputUsername1").val();

    $.ajax({
      type: 'POST',
      url: "http://localhost:8000/sessions", //note frontend needs to be 3000
      data: {
        user: {
          username: username,
          password: psw
        }
      },
      success: function(response) {
        console.log("create session / logged in", response);
        // window.location = "bulletin_board.html";
        $('#bBoard').show();
        authenticate();
      },
    });

    console.log(psw, username);
    
  });
//
   function authenticate() {
     $.ajax({
        type: "GET",
        url: "http://localhost:8000/authenticated",
        xhrFields: {
          withCredentials: true
        },
        success: function(response) {
          console.log(response);
       }
     });
   };

/*   $.ajax({
     method: "DELETE",
     url: "http://localhost:3000/sessions",
     success: function(response) {
       console.log("DELETED");
       location.reload(); // reloads the messages with out the deleted ones
     }
   });*/
  
// post new message
   $('#postBtn').click(function(event){
     event.preventDefault();
     var msg = $("#msg").val();
    
     $.ajax({
       type: 'POST',
       url: "mongodb://127.0.0.1:27017/Whiskey-lovers/users",
       data: {
         newMessage: {
           newMessage:  $('#msg').val(),
           //author: $('#newAuthor').val()// do I need this? 
     // on the front end you would enter the new post message and new author into its input areas and 
     // on click it gets posted to the database      
         }
       },
       dataType: 'json',
       success: function(response){
         console.log("Whiskey-lovers message posted");
       location.reload();// reloads the html page with the new posts added. 
       }
     })
   });

   function getAll() { // this function just basically gets all the database items and shows it on the html quote list
     $.ajax({
       type: 'GET',
       url: "mongodb://127.0.0.1:27017/Whiskey-lovers/users",
       dataType: 'json',
       success: function(response){
         for (var i = 0; i < response.length; i++) {
           $('#messageList').append('<div class="row"><div class="col-xs-4">' + response[i].messages + '</div><div class="col-xs-4">' + response[i].author + '</div><div class ="col-xs-4">' + response[i]._id + '</div></div>')
         }
         console.log(response);
       }
     })
   };
});
