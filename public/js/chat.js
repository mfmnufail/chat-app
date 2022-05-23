const socket = io();

  socket.on("message", (message) => {
    console.log(message);
  });

  window.onload= function(){

document.querySelector("#message-form").addEventListener("submit", (e) => {
      
          e.preventDefault();
          //   const message = e.target.elements.message.value;
          const message = e.target.elements.message.value;
          console.log(`>> ${message}`);
          socket.emit("chat", message);
        });
  
        document.querySelector("#send-location").addEventListener("click", ()=>{
          
          if(!navigator.geolocation){
      
            return alert("Geolocatoin is not supported by your browser")
          }
      
          navigator.geolocation.getCurrentPosition((location)=>{
              console.log(location)


              socket.emit("sendLocation", {lat:location.coords.latitude, long:location.coords.longitude} )
          })
        })
  }  


 

  
  



