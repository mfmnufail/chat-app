const socket = io();

socket.on("message", (message) => {
  console.log(message);
});
window.onload = function () {
const $messageForm = document.querySelector("#message-form");
const $messageInput = $messageForm.querySelector("input")
const $messageButton = $messageForm.querySelector("button")
const $sendLocation = document.querySelector("#send-location");


  $messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
      // const message = e.target.elements.message.value;
      const message = e.target.elements.message.value;

      $messageButton.setAttribute('disabled', "disabled")
      
      socket.emit("chat", message, (error)=>{
        
        $messageInput.value = ''
        $messageInput.focus()
        
      if(error){
        return console.log(error)
      }
      console.log(`>> ${message}`);
      console.log("Message delivered successfully!")

      $messageButton.removeAttribute("disabled")
    });
  });

  $sendLocation.addEventListener("click", () => {

    $sendLocation.setAttribute('disabled','disabled')
    if (!navigator.geolocation) {
      return alert("Geolocatoin is not supported by your browser");
    }

    navigator.geolocation.getCurrentPosition((location) => {
      console.log(location);

      socket.emit("sendLocation", {
        lat: location.coords.latitude,
        long: location.coords.longitude,
      }, ()=>{
        console.log("Location shared successfully!")
        $sendLocation.removeAttribute('disabled')
      });
    });
  });
};
