import $ from 'jquery'; 

import  SockJS from 'sockjs-client';
import  Stomp from 'stompjs';

var stompClient = null;  

function connect() {   
    // var socket = new SockJS('https://api-cinemas.herokuapp.com/ws');
    var socket = new SockJS('https://api-cinemas.herokuapp.com/ws');
    stompClient = Stomp.over(socket); 
    stompClient.connect({}, onConnected, onError);
}
connect();

function onConnected(){
    // stompClient.subscribe('/message_receive/'+"1", ReceMessT);
}

function onError(error) {
    console.log("Error")
}

export function onSendT(value){
    console.log(value)

    let obj= {
        ghe:value
    }

    stompClient.send("/message_send/chat.sendMessage/seat", {}, JSON.stringify(obj),);
}


$(document).ready(function () {

    $("#testsocket").click(function (e) { 
        e.preventDefault();
    });
    
});