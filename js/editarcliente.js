(function(){
    let DB; 
    let idCliente; 

    const nombreInput = document.querySelector('#nombre'); 
    const emailInput = document.querySelector('#email'); 
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario'); 
      

    document.addEventListener('DOMContentLoaded', () =>{
        conectarDB(); 

        //Actualiza el registro 

        formulario.addEventListener('submit', actualizarCliente); 

        //Verificar el id de la url 

        const parametrosURL = new URLSearchParams(window.location.search); 
        idCliente = parametrosURL.get('id'); 

        if(idCliente){
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 100);          
        }

    }); 

    function obtenerCliente(idObtener){
        const transaction = DB.transaction(['crm'], 'readwrite'); 
        const objectStore = transaction.objectStore('crm'); 
        const cliente = objectStore.openCursor(); 
        cliente.onsuccess = function(event){
            const cursor = event.target.result; 

            if(cursor){
                if(cursor.value.id === Number(idObtener)){
                    llenarFormulario(cursor.value)
                }
                cursor.continue(); 
            }
        }
        
    }

    //Función que llena automaticamente el formulario 

     function llenarFormulario(datosCliente){
        const {nombre, email, telefono, empresa} = datosCliente

        nombreInput.value = nombre; 
        emailInput.value = email; 
        telefonoInput.value = telefono;
        empresaInput.value = empresa;  
        

     }

    //Funcion para conectarnos a la base de datos 
    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm', 1)

        abrirConexion.onerror = function (){
            console.log('Hubo un error'); 
        }

        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result; 
        }
    }

    function actualizarCliente(event){
        event.preventDefault(); 

        if(nombreInput.value === '' || emailInput.value === ''|| telefonoInput.value === '' || empresaInput.value ===''){
            mostrarAlerta('Todos los campos son abligatorios', formulario, 'error'); 
            return; 
        }

        //Actualizar cliente 

        clienteActuzalido = {
            nombre: nombreInput.value,
            email: emailInput.value, 
            telefono: telefonoInput.value,
            empresa: empresaInput.value, 
            id: Number(idCliente) 
        }

        const transaction = DB.transaction(['crm'], 'readwrite'); 
        const objectStore = transaction.objectStore('crm'); 
        
        objectStore.put(clienteActuzalido); 

        transaction.oncomplete = function () {
            mostrarAlerta('Registro actualizado correctamente', formulario); 

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2500);
        }

        transaction.onerror = function (){
            mostrarAlerta('Fallo al actualizar', formulario, 'error'); 
        }
    }

})()