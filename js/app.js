//Creando un espacio para que las variables no dejes ese espacio

(function(){
    let DB; //Guarda los valores de la base de datos

    const tablaClientes = document.querySelector('#listado-clientes');
    const h2 = document.querySelector('#clientess'); 
    
    
    document.addEventListener('DOMContentLoaded', ()=>{
        crearDB(); 

        if(window.indexedDB.open('crm', 1)){
            mostrarClientes(); 
        }

        tablaClientes.addEventListener('click', elminarRegistro)
    } ); 

    //Crea la base de datos en indexdb

    function crearDB(){
        const crearDB = window.indexedDB.open('crm',1); 

        crearDB.onerror = function(){
            console.log('No fue creada la base de datos'); 
        };

        crearDB.onsuccess = function(){
            console.log('la base de datos fue creada correctamente'); 
            DB = crearDB.result; //Cuando la base de datos se crea correctamente se crea a esa variable 
        };   
        
        crearDB.onupgradeneeded = function(event){
            const db= event.target.result; //db es el resultado de lo que se ejecuta en esa función, que es la base de datos 

            const objectStore = db.createObjectStore('crm', {
                keyPath: 'id', 
                autoIncrement: true, 
            })

            objectStore.createIndex('nombre', 'nombre', {unique: false}); 
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('telefono', 'telefono', {unique: false}); 
            objectStore.createIndex('empresa', 'empresa', {unique: false}); 
            objectStore.createIndex('id', 'id', {unique: true}); 

            console.log('DB creada');

        }


    }

    

    function mostrarClientes(){
        const abrirConexion = window.indexedDB.open('crm', 1); 

        abrirConexion.onerror = function (){
            console.log('Hubo un error');
        }

        abrirConexion.onsuccess = function (){
            DB = abrirConexion.result;

            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function(event){
                const cursor = event.target.result;
                
                if(cursor) {                
                    const {nombre, email, telefono, empresa, id} = cursor.value;
    
                    
                    tablaClientes.innerHTML += `<tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                        </td></tr>`;                
                    cursor.continue(); 
                }
            }

        }        
    }

    function elminarRegistro(event){
       if(event.target.classList.contains('eliminar')){
        const idEliminar = Number(event.target.dataset.cliente); 
        
        const confirmar = confirm('Deseas eliminar este cliente'); 

        if(confirmar){
            const transaction = DB.transaction(['crm'], 'readwrite'); 
            const objectStore = transaction.objectStore('crm'); 
            objectStore.delete(idEliminar); 

            transaction.oncomplete= function () {
                event.target.parentElement.parentElement.remove(); 
                mostrarAlerta('Registro eliminado correctamente', h2); 

            }

            transaction.onerror = function (){
                mostrarAlerta('Error al elmiminar el registro', h2, 'error'); 
            }
        }
       }
    }

})(); 