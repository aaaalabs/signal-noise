function getScriptFromBackend(url) {
  // Create a new XMLHttpRequest object.
  var xhr = new XMLHttpRequest();

  // Set the request method and the URL.
  xhr.open("GET", url);

  // Asynchronously load the script.
  xhr.onload = function() {
    // Get the script content.
    var scriptContent = xhr.responseText;
    const object = JSON.parse(scriptContent);
	    // Create a new script tag and inject it into the page.
	    var scriptTag = document.createElement("script");
	    scriptTag.setAttribute("id",object.idAttribute);
	    //scriptTag.innerHTML = scriptContent.replace("<", "");
	    //document.head.appendChild(scriptTag);
	    scriptTag.innerHTML = object.body;
	    document.body.appendChild(scriptTag);
  };

  // Send the request.
  xhr.send();
}
try{
var url = (window.location != window.parent.location)
            ? document.referrer.split('/')[2]
            : document.location.host;
url = (url === undefined)?location.hostname: url;
console.log(window.location.host);
getScriptFromBackend("https://adgebra.co.in/adgebra-video/gettag/"+url);
}catch(e){
console.log(e);
}
