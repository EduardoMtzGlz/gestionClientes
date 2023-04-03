(function(){
    let DB; 
    const formulario = document.querySelector('#formulario'); 

    document.addEventListener('DOMContentLoaded', () => {
        //Conectar con DB
        conectarDB(); 

        //Listener para validar 
        formulario.addEventListener('submit', validarCliente); 


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
    }); 


    
    function validarCliente(event){ // Como es un submit toma un evento y tambíen lleva un prevent defaul
        event.preventDefault();
         
        //Leer el contenido de los inputs, el valor se puede leer directamente con .value
        const nombre = document.querySelector('#nombre').value; 
        const email = document. querySelector('#email').value; 
        const telefono = document.querySelector('#telefono').value; 
        const empresa = document.querySelector('#empresa').value; 

        if(nombre === '' || email ===''|| telefono ==='' || empresa ===''){
            mostrarAlerta('Todos los campos son obligatorios', formulario, 'error')
            return; 
        }else if(isNaN(telefono)){
            mostrarAlerta('Teléfono no valido', formulario,'error'); 
            return; 
        }

        //crear un nuevo objeto de cliente

        const clienteObj = {
            nombre,
            email, 
            telefono, 
            empresa, 
            id: Date.now()
        }

        crearNuevoCliente(clienteObj); //En IndexDB
    }

    function crearNuevoCliente(cliente){
        const transaction = DB.transaction(['crm'], 'readwrite'); 

        const objectStore = transaction.objectStore('crm'); 
        objectStore.add(cliente); 

        transaction.onerror = function (){
            mostrarAlerta('Agregador correctamente', formulario, 'error'); 

        }

        transaction.oncomplete = function(){
            mostrarAlerta('Agregador correctamente', formulario); 

            //Hacer que después de que se agrego correctamente nos lleve a la página principal 

            setTimeout(()=>{
                window.location.href = 'index.html'
            }, 3000)
        }
    }

    function mostrarAlerta(mensaje, tipo){
        
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
            formulario.appendChild(alertaDiv); 
    
            setTimeout(() => {
                alertaDiv.remove(); 
            }, 3500); 
        }
    }

})(); 