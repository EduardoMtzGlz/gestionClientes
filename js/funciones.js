
//Funcion para conectarnos a la base de datos 
function conectarDB(){
    const abrirConexion = window.indexedDB.open('crm',1)

    abrirConexion.onerror = function (){
        console.log('Hubo un error'); 
    }

    abrirConexion.onsuccess = function(){
        DB = abrirConexion.result; 
        console.log('Conectado correctamente'); 
    }
}

 function mostrarAlerta(mensaje,lugar, tipo){
        
    const verAlerta = document.querySelector('.alerta');     

    if(!verAlerta){
        const alertaDiv = document.createElement('div'); 
        alertaDiv.classList.add('px-4', 'py-2', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6','text-center', 'border', 'alerta'); 

        if(tipo === 'error'){
            alertaDiv.classList.add('bg-red-100', 'border-red-400', 'text-red-700'); 
        }else{
            alertaDiv.classList.add('bg-green-100', 'border-green-400', 'text-green-700'); 
        }

        alertaDiv.textContent = mensaje; 
        lugar.appendChild(alertaDiv); 

        setTimeout(() => {
            alertaDiv.remove(); 
        }, 3500); 
    }
}
