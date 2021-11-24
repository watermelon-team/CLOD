            
            var mqtt;
            var reconnectTimeout = 2000;

            //var host="test.mosquitto.org"; //change this
            //var port=8080;

            var host="192.168.1.171"; //change this
            var port=9001;

            var topic = "/clod/calendar/food";


            var food = document.getElementsByClassName("food");

            var shownFruits = JSON.parse(localStorage.getItem("shownFruits"));
            //var shownFruits = [];

            if(shownFruits == null){
                shownFruits = [];
            }
    
    
    // connect to broker
        function MQTTconnect() {

        //fai comparire/sparire cibo
            for (let i = 0; i < shownFruits.length; i++) {
                for (let y = 0; y < food.length; y++) {
                if( food[y].id == shownFruits[i]){
                    food[y].classList.remove('hiddenFood');
                    //console.log(food[y]);
                    }
                }            
            }

            console.log("connecting to "+ host +" "+ port);
            mqtt = new Paho.MQTT.Client(host,port,"clientjs"); //create client object
            //document.write("connecting to "+ host);
            var options = {
                //useSSL:true,
                timeout: 2,
                onSuccess: onConnect, //callback function
                onFailure: onFailure,
                };
            
            mqtt.onMessageArrived = onMessageArrived
            mqtt.connect(options); //connect
            
    }
    
    // publish a message
    function onConnect() {      
            console.log("Connected");
            mqtt.subscribe(topic); //subscribe to topic
          }
        
    function onFailure(message){
        console.log("Connection Attempt to host "+host+"Failed");
        setTimeout(MQTTconnect, reconnectTimeout);
    }

    function sendMessage(obj){
        var btnId = obj.id;
        message = new Paho.MQTT.Message(btnId+"Img"); //define message
        message.destinationName = topic; //publish to topic 
        mqtt.send(message); //publish message
        console.log("message sent");
    }
    
    function onMessageArrived(msg){ 

    //sta scadendo il cibo
        if(msg.payloadString == 'foodIsExpiring'){

        //fai comparire ricette corrette
            for (let i = 0; i < recipes.length; i++) {
                recipes[i].classList.remove('hiddenFood');
                for (let y = 0; y < shownFruits.length; y++) {
                if( !recipes[i].classList.contains(shownFruits[y])){
                    console.log(recipes[y].id+' non contiene '+shownFruits[y]);
                    recipes[i].classList.add('hiddenFood');
                    } 
                }                        
            }

        }

        else{   
   //fai comparire / scomparire cibo          
        for (let i = 0; i < food.length; i++) {
            if(food[i].id == msg.payloadString){
              //if(msg.payloadString == 'X00145ITVF'){
                if (food[i].classList.contains('hiddenFood')){
                    food[i].classList.remove('hiddenFood');

                    shownFruits.push(msg.payloadString);
                    
                }
                else{
                    food[i].classList.add('hiddenFood');

                    for (let i = 0; i < shownFruits.length; i++) {
                        if(shownFruits[i]==msg.payloadString){
                            shownFruits.splice(i, 1); 
                            console.log(shownFruits);
                        }
                    }                    
                }
            }
          }

        }

          console.log(msg.payloadString);        
    }

//cambia pagina
    function changePage(){
        localStorage.setItem("shownFruits", JSON.stringify(shownFruits));
    }
    