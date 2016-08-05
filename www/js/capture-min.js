var longitud ="";
var latitud ="";
var app = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;
        navigator.geolocation.getCurrentPosition(onSuccess901, onError);
        /*function disp(pos) {
            longitud = pos.coords.longitude;
            latitud = pos.coords.latitude;
            //$('.lat-view').html(pos.coords.latitude);
            //$('.long-view').html(pos.coords.longitude);
        }
        $('#btn-foto').click(function () {
            navigator.geolocation.getCurrentPosition(disp);
        });*/

    }
};

function onSuccess901(position) {
        //var element = document.getElementById('geolocation');
        latitud = position.coords.latitude;
        longitud = position.coords.longitude;
        /*element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
                            'Longitude: '          + position.coords.longitude             + '<br />' +
                            'Altitude: '           + position.coords.altitude              + '<br />' +
                            'Accuracy: '           + position.coords.accuracy              + '<br />' +
                            'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
                            'Heading: '            + position.coords.heading               + '<br />' +
                            'Speed: '              + position.coords.speed                 + '<br />' +
                            'Timestamp: '          + position.timestamp                    + '<br />';*/
    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        swal('Error','Posición no capturada');
        //alert('code: '    + error.code    + '\n' +
              //'message: ' + error.message + '\n');
    }


window.onload = function () {
    document.getElementById("foto").style.width = (window.innerWidth - 50) + "px";
    document.getElementById("foto").style.height = (window.innerWidth - 50) + "px";
    document.getElementById("foto").style.backgroundImage = "url('img/cordova2.png')";
    document.getElementById("foto").style.backgroundSize = "50% 50%";
};

function capturePhoto() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 90,
        destinationType: Camera.DestinationType.DATA_URL,
        correctOrientation: true,
        targetWidth: 1000,
        targetHeight: 1000
    });
}

function getPhoto(source) {
    navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 90,
        destinationType: destinationType.FILE_URI,
        sourceType: source
    });
}

function onSuccess(imageData) {

    document.getElementById("foto").style.backgroundImage = "url('data:image/jpeg;base64," + imageData + "')";
    document.getElementById("foto").style.backgroundSize = "100% 100%";
    URIimg = "data:image/jpeg;base64,'" + imageData + "'";
    //onPhotoURISuccess("data:image/jpeg;base64,'"+imageData+"'");    
}

function onPhotoURISuccess(imageURI) {
    document.getElementById("foto").style.backgroundImage = "url('" + imageURI + "')";
    document.getElementById("foto").style.backgroundSize = "100% 100%";
    URIimg = String(imageURI);
}

var hoy = "";
var ruta = "";
var nombreArchivo = "";
 var descripcion = "";


function enviarFoto(URIimg) {
    //enviarPosicion();
    //alert(longitud);
    nombreArchivo = prompt("Ingrese un nombre a la imagen", "");
    while (nombreArchivo == "") {
        nombreArchivo = prompt("Ingrese un nombre a la imagen", "");
    }
    descripcion = prompt("Ingrese úna descripción,ubicación o referencia","")
    while(descripcion == ""){
        descripcion = prompt("Ingrese úna descripción,ubicación o referencia","")
    }
    if(nombreArchivo != "" && nombreArchivo != null && descripcion != "" && descripcion != null ){
        swal({   title: "Enviando...",   text: "El archivo se esta enviando espere el mensaje de confirmación.",   timer: 3000,   showConfirmButton: false });
        nombreArchivo = nombreArchivo.replace(/ /gi,'_');
        //alert("enviando....")
        var opciones = new FileUploadOptions();
        opciones.fileKey = "file";
        //opciones.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
        opciones.fileName = nombreArchivo;
        opciones.mimeType = "image/jpeg";
        var parametros = new Object();
        parametros.value1 = "test";
        parametros.value2 = "param";
        
        opciones.parametros = parametros;
        opciones.chunkedMode = false;
        var ft = new FileTransfer();
        ft.upload(URIimg, "http://pekin.sedalib.com.pe:90/SIC/upload.php", win, fail, opciones);
        //alert("enviado...");
        hoy = new Date();
        var dd = hoy.getDate();
        var mm = hoy.getMonth()+1; //hoy es 0!
        var yyyy = hoy.getFullYear();

        if(dd<10) {
            dd='0'+dd
        } 

        if(mm<10) {
            mm='0'+mm
        } 

        hoy = dd+''+mm+''+yyyy;
        ruta = "http://pekin.sedalib.com.pe:90/SIC/imagenes/"+hoy+"/"+nombreArchivo+".jpg";
        
    } else{
        swal("","Debe rellenar todos los campos que se piden para poder efectuar su operación.");
        //enviarDenuncia(nombreArchivo,descripcion,ruta);
    }
    //alert("longitud = " + longitud + "\nlatitud = "+latitud);
}

function enviarPosicion() {
    $.ajax({
        type: "POST",
        url: conexion + "upload.php",
        data: "longitud=" + longitud + "&latitud=" + latitud,
        cache: false,
        dataType: "text",
        success: onSuccess7
    });
}

function onSuccess7(data) {
    swal({ title:data, timer: 3000,   showConfirmButton: false });
    regresar();

}

function enviarDenuncia(){
    //alert("Guardando...");
    $.ajax({
        type: "POST",
        url: "http://pekin.sedalib.com.pe:90/SIC/denuncia.php",
        data: "clave="+"hajsad992aaa"+"&longitud=" + longitud + "&latitud=" + latitud+"&nombre="+nombreArchivo+"&descripcion="+descripcion+"&ruta="+ruta,
        cache: false,
        dataType: "text",
        success: function(data){
            //alert(data);
            swal({   title: "Enviado",   
                text: "Archivo enviado con éxito. Gracias por apoyar a sedalib",   
                type: "success",   
                showCancelButton: false,   
                confirmButtonColor: "#296fb7",   
                confirmButtonText: "Ok",   
                closeOnConfirm: false }, 
                function(){   
                        regresar();
                 });
            
        }
    });
}


function win(r) {
    console.log("code = " + r.responseCode);
    console.log("response = " + r.response);
    console.log("Sent = " + r.bytesSent);
    //alert(r.response);
    enviarDenuncia();

}

function fail(error) {
    //alert("A ocurrido un error : code = " + error.code);
    swal("","Error al envio de Foto");
}

function onFail(message) {
    //alert('Error por: ' + message);
    swal("","Error encontrado en la camara");
}


function regresar() {
    if (localStorage.getItem("camara") == 1) {
        location.href = "main.html#inicio";
    } else if (localStorage.getItem("camara") == 2 || localStorage.getItem("camara") == 3) {
        location.href = "main.html#usuarios";
    }
}
