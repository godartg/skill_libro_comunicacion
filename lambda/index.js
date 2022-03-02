/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');


/*=====================================================================*/

const lista_actividad = [
    /*actividad 1 - pag 5*/
    'Lee el título del texto de la página 6; luego, responde las preguntas: ¿De qué crees que trata el texto? ¿Dónde crees que se desarrollará la historia? ¿Para qué crees que leerás el texto? Observa el texto y responde: ¿qué texto crees que leerás?, ¿cómo lo sabes?',
    /*actividad 2 - pag 6*/
    'Lee el texto en forma silenciosa y sin detenerte, para que tengas idea de qué trata. Luego contesta las preguntas: ¿Dónde queda la escuela de Luis? Y ¿Por qué crees que Luis se quedo solo a la hora del recreo?',
    /*actividad 3 - pag 7*/
    'Lee con atención y responde las preguntas: ¿Quién es el personaje principal del cuento? ¿Por qué?, ¿A qué se debió el cambio de comportamiento de las compañeras y los compañeros de Luis?, Subraya la parte del texto donde se menciona lo que ocasionó dicho cambio.',
    /*actividad 4 - pag 8*/
    'Observa el organizador gráfico y complétalo con la idea más importante de cada parte del cuento que leíste:',
    /*actividad 5 - pag 8*/
    'Numera las imágenes según el orden en que ocurrieron los hechos.',
    /*actividad 6 - pag 9*/
    'Encierra las palabras que expresan las características de las compañeras y los compañeros de Luis después de que la profesora habló con ellos.',
    /*actividad 7 - pag 9*/
    'Intercambia ideas con una compañera o un compañero y respondan: ¿qué opinan de la actitud de los estudiantes al inicio del cuento?',
    /*actividad 8 - pag 9*/
    '¿Qué significa la palabra “cuchichear”? Lee nuevamente el párrafo donde se encuentra esa palabra y responde la pregunta.',
    /*actividad 9 - pag 9*/
    'En la siguiente expresión: “¡Luis, siéntate conmigo!”, ¿para qué se habrán colocado los signos de exclamación?',
    /*actividad 10 - pag 10*/
    'Lee y realiza lo que indica Esteban.',
    /*actividad 11 - pag 10*/
    'Pinta los cuadernos que señalen lo que conseguiste realizar luego de leer el cuento.'
    ];

const lista_ayuda = [
    'En esta actividad procura solo leer el título del texto y luego responde según lo que pienses. ',
    'Procura leer cuidadosamente, tómate tu tiempo, para que puedas comprender correctamente el texto. Detente cuando veas un símbolo celeste y contesta la pregunta del cuadro celeste. Luego sigue leyendo hasta que veas un símbolo amarillo, contesta la pregunta del cuadro amarillo. ¡Vamos! ¡Tú puedes!  ',
    'Recuerda que los personajes principales son aquellos en los que se centra la trama de la historia. También recuerda que un cambio se da por una determinada acción.',
    'Recuerda que el inicio es el comienzo de la trama de la historia, el nudo son los acontecimientos que se dan en el medio de la historia y el desenlace es como termina la historia.',
    'Mira fijamente cada una de las imágenes en el libro, recuerda el texto leído y enumera la secuencia de todo lo que paso en la historia. ',
    'Recuerda la amabilidad es una actitud personal y positiva hacia el resto de seres que nos rodean, ser tímido es aquél que tiende a mostrarse temeroso, alguien acogedor es tener un trato agradable con otra persona, alguien egoísta no se preocupa de los demás, alguien solidario es quien ayuda a los demás y alguien indiferente es quien no siente inclinación ni rechazo hacia otra persona.',
    'Da una opción sobre la los compañeritos de Luis al principio del cuento. Escucha también la opinión de tu compañero o compañera para que puedan responder la pregunta. ',
    'Recuerda que los niños y niñas comenzaron hablar entre ellos sin que se diera cuenta Luis',
    'Recuerda que un símbolo de exclamación se usa para indicar sorpresa, asombro, alegría, súplica, mandato, deseo, etc. ',
    '¿Recuerdas tus primeros días de clases?, ¿cómo te sentiste?, ¿qué pasó? Escribe un listado sobre los hechos que más recuerdes.',
    'Colorea todo lo que has aprendido en la actividad número uno, me gustó mucho haberte ayudado.'
    ];



const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Bienvenido, soy Alexa. Yo te ayudaré en tus actividades del libro de comunicación del tercer grado de primaria. Si tienes problemas en tus lecciones puedes pedirme ayuda. Prueba diciendo: Necesito ayuda' ;
        const speakOutput2 = 'Si tienes alguna duda con alguna actividad no dudes en preguntarme.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput2)
            .getResponse();
    }
};



const AyudaManejador = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ayuda_intent';
    },
    handle(handlerInput) {
        const speakOutput = '¿En qué página necesitas ayuda?';
        const speakOutput2 = 'Díme por ejemplo: Necesito ayuda en la página cinco';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput2)
            .getResponse();
    }
};



const ConsultaManejador = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'consulta_intent';
  },
  async handle(handlerInput) {

    const DatoPagina = handlerInput.requestEnvelope.request.intent.slots.pagina.value;/*Número de página*/
    const DatoActividad= handlerInput.requestEnvelope.request.intent.slots.actividad.value;/*Actividad 1 , 2 , 3 ...*/
    const DatoPregunta = handlerInput.requestEnvelope.request.intent.slots.pregunta.value;/*pregunta A B C ....*/
    
    //const item = DatoActividad - 1 ;
    //let speechText = `La actividad ${DatoActividad} de la página ${DatoPagina} dice: ${lista_actividad[item]}. ${lista_ayuda[item]}`;
    
    let speechText = `Dato vacío `;
    
    //localizar página 
    switch (DatoPagina) {
      case '5':
        speechText = `La actividad ${DatoActividad} de la página ${DatoPagina} dice: ${lista_actividad[0]}. ${lista_ayuda[0]}`;
        
        break;
      case '6':
        speechText = `La actividad ${DatoActividad} de la página ${DatoPagina} dice: ${lista_actividad[1]}. ${lista_ayuda[1]}`;
        break;
      case '7':
        speechText = `La actividad ${DatoActividad} de la página ${DatoPagina} dice: ${lista_actividad[2]}. ${lista_ayuda[2]}`;
        break;
      case '8':/*actividad 4 y 5*/
        if(DatoActividad ==='4'){
            speechText = `La actividad ${DatoActividad} de la página ${DatoPagina} dice: ${lista_actividad[3]}. ${lista_ayuda[3]}`;
        }
        else if(DatoActividad==='5'){
            speechText = `La actividad ${DatoActividad} de la página ${DatoPagina} dice: ${lista_actividad[4]}. ${lista_ayuda[4]}`;
        }
        break;
      case '9':/*actividad 6,7,8 y 9*/
        if(DatoActividad === '6'){
            speechText = `La actividad ${DatoActividad} de la página ${DatoPagina} dice: ${lista_actividad[5]}. ${lista_ayuda[5]}`;
        }else if(DatoActividad === '7'){
            speechText = `La actividad ${DatoActividad} de la página ${DatoPagina} dice: ${lista_actividad[6]}. ${lista_ayuda[6]}`;
        }else if(DatoActividad === '8'){
            speechText = `La actividad ${DatoActividad} de la página ${DatoPagina} dice: ${lista_actividad[7]}. ${lista_ayuda[7]}`;
        }else if(DatoActividad==='9'){
            speechText = `La actividad ${DatoActividad} de la página ${DatoPagina} dice: ${lista_actividad[8]}. ${lista_ayuda[8]}`;
        }
        /*else = */
        
        break;
      case '10':/*actividad 10 y 11*/
        if(DatoActividad==='10'){
            speechText = `La actividad ${DatoActividad} de la página ${DatoPagina} dice: ${lista_actividad[9]}. ${lista_ayuda[9]}`;
        }
        else if(DatoActividad==='11'){
            speechText = `La actividad ${DatoActividad} de la página ${DatoPagina} dice: ${lista_actividad[10]}. ${lista_ayuda[10]}`;
        }
        break;
      default:
        speechText = `la página ${DatoPagina} no contiene una actividad ${DatoActividad}`;
    }
        
    
    
    

    //const attributesManager = handlerInput.attributesManager;
    
    const responseBuilder = handlerInput.responseBuilder;

    //guardar dato en memoria
    /*
    const attributes = await attributesManager.getSessionAttributes() || {};
    attributes.DatoActividad = DatoActividad; 
    attributesManager.setSessionAttributes(attributes);
    */
    return responseBuilder
      .speak(speechText)
      .reprompt(`Si tienes alguna duda con alguna actividad no dudes en preguntarme.`)
      .getResponse();
  },
};


const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

/*
const ActividadUnoManejador = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'actividad_uno';
    },
    handle(handlerInput) {
        const speakOutput = 'Estás en la actividad número uno, ve a la página seis de tu libro de comunicación. Deberás leer el texto titulado. Nuevos amigos. Una vez que termines dime. Ya terminé de leer el primer texto.';
        const speakOutput2 = 'Recuerda leer el texto en forma silenciosa y sin detenerte, para que tengas idea de qué trata. Una vez que termines dime. Ya terminé de leer el primer texto.'
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput2)
            .getResponse();
    }
};



const TextoLeidoUnoManejador = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'texto_leido_uno';
    },
    handle(handlerInput) {
        const speakOutput = 'Muy bien! ahora comencemos con las preguntas. Pregunta número uno. ¿Dónde queda la escuela de Luis?. Alternativas: a. Tacna, b. Cajamarca, c. Arequipa. Dime la letra de la alternativa correcta';
        const speakOutput2 = '¿Dónde queda la escuela de Luis?. Alternativas. a. Tacna, b. Cajamarca, c. Arequipa. Dime la letra de la alternativa correcta.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput2)
            .getResponse();
    }
};


const RespuestaUnoManejador = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'respuesta_uno';
    },
    handle(handlerInput) {
        
        var respuestaalumno = handlerInput.requestEnvelope.request.intent.slots.respuesta.value;
        var resultado = "";

        
        if(respuestaalumno === 'B'){
            resultado = "Felicidades, Respuesta correcta es " + respuestaalumno + " Cajamarca.";
        }
        
        else{
            resultado = "Esa no es la respuesta, intenta recordarlo.";
        }
        
        
        const speakOutput = resultado;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


*/



/*
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};*/

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Chau! Nos vemos! ';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};








/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        AyudaManejador,
        ConsultaManejador,
        /*HelpIntentHandler,*/
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();