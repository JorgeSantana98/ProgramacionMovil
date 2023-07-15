const  nombre = document.getElementById("name")
const  email = document.getElementById("email")
const form = document.getElementById("form")
const parrafo = document.getElementById("warnings")

form.addEventListener("submit" ,ex=>{
    e.preventDefault()
    let warnings = ""
    let entrar = false
    if(nombre.value.length < 6){
        alert("nombre muy corto")
        // warnings+='El nombre no es valido <br>'
        // entrar = true
    }
    // if(entrar){
    //     parrafo.innerHTML = warnings
    // }
})
