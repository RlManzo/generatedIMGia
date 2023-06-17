

const form = document.getElementById("form");
const input = document.getElementById("prompt");
const resultado = document.querySelector("#resultado")
form.addEventListener("submit", (e)=>{
    e.preventDefault();
    resultado.innerHTML = `<div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>`;
    
    console.log("loading")
   const data = {prompt: input.value};
   const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
   }
   fetch("/generate-image", options)
   .then(response => response.json())
   .then((data) =>{
           console.log({data});
           if(data?.fileName){
                  resultado.innerHTML = ""
                  const image = document.createElement("img");
                  image.src = './images/'+ data.fileName;
                  image.className = "imgGeneratedClass";
                  
                  resultado.appendChild(image)
           }
   }).catch((error)=>{
    console.log("error retrieving image", error.message)
   })

   
   ;
})