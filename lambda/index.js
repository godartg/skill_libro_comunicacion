/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const axios = require('axios');
//const listaActividadUrl = 'https://godartg.github.io/Ayuda_Alexa.github.io/Lista_actividad.json';
//const listaAyudaUrl = 'https://godartg.github.io/Ayuda_Alexa.github.io/Lista_ayuda.json';
//const listaAyudaUrl= 'https://4e8f-186-148-196-74.ngrok.io/api/obtenerAyudaActividad/2/B/Comunicacion/Informacion/1/2';
//const listaActividadUrl= 'https://4e8f-186-148-196-74.ngrok.io/api/obtenerDescripcionActividad/2/B/Comunicacion/Informacion/1/2';
const listaAyudaUrl= 'https://libro-comunicacion.herokuapp.com/api/obtenerAyudaActividad/';
const listaActividadUrl= 'https://libro-comunicacion.herokuapp.com/api/obtenerDescripcionActividad/';
/*=====================================================================*/



const obtenerActividades = async (pagina, actividad, curso, grado, seccion) => {
  try {
    const { data } = await axios.get(listaActividadUrl+grado+'/'+seccion+'/'+ curso +'/'+'Comunicaci%C3%B3n%203%20cuaderno%20de%20trabajo%20para%20tercer%20grado%20de%20educaci%C3%B3n%20primaria%202020'+ '/' + pagina +'/' + actividad);
    //const data  = listaActividadUrl+ grado +'/'+ seccion +'/'+ curso +'/'+ 'Comunicaci%C3%B3n%203%20cuaderno%20de%20trabajo%20para%20tercer%20grado%20de%20educaci%C3%B3n%20primaria%202020' + '/' + pagina +'/' + actividad;
    return data;
  } catch (error) {
    console.error('no se pudo obtener datos', error);
  }
};

const obtenerAyudas = async (pagina, actividad, curso, grado, seccion) => {
  try {
    const { data } = await axios.get(listaAyudaUrl+grado+'/'+seccion+'/'+ curso +'/'+ 'Comunicaci%C3%B3n%203%20cuaderno%20de%20trabajo%20para%20tercer%20grado%20de%20educaci%C3%B3n%20primaria%202020'+ '/' +pagina+'/'+actividad);
    return data;
  } catch (error) {
    console.error('no se pudo obtener datos', error);
  }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Bienvenido, soy Alexa. Yo te ayudaré en tus actividades. Prueba diciendo: Necesito ayuda' ;
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
    try {
        const DatoPagina = handlerInput.requestEnvelope.request.intent.slots.pagina.value;/*Número de página*/
        const DatoActividad= handlerInput.requestEnvelope.request.intent.slots.actividad.value;/*Actividad 1 , 2 , 3 ...*/
        const DatoCurso = handlerInput.requestEnvelope.request.intent.slots.curso.value;/*Curso Matemática, Comunicación, Ciencia y ambiente, personal social ....*/
        const DatoSeccion = handlerInput.requestEnvelope.request.intent.slots.seccion.value;/*seccion A B C D E ....*/
        const DatoGrado = handlerInput.requestEnvelope.request.intent.slots.grado.value;/*grado 1 2 3 4 5 6 ....*/
        //let speechText = listaAyudaUrl +'/'+ DatoGrado +'/'+ DatoSeccion +'/'+ DatoCurso +'/'+ 'Comunicaci%C3%B3n%203%20cuaderno%20de%20trabajo%20para%20tercer%20grado%20de%20educaci%C3%B3n%20primaria%202020' + '/' +DatoPagina+'/'+DatoActividad;
        //let speechText = listaActividadUrl +'/'+ DatoGrado +'/'+ DatoSeccion +'/'+ DatoCurso +'/'+ 'Comunicaci%C3%B3n%203%20cuaderno%20de%20trabajo%20para%20tercer%20grado%20de%20educaci%C3%B3n%20primaria%202020' + '/' +DatoPagina+'/'+DatoActividad;
        const lista_actividad = await obtenerActividades( DatoPagina, DatoActividad, DatoCurso, DatoGrado, DatoSeccion );
        const lista_ayuda = await obtenerAyudas( DatoPagina, DatoActividad, DatoCurso, DatoGrado, DatoSeccion);
        let speechText = `La actividad ${DatoActividad} de la página ${DatoPagina} dice: ${lista_actividad['detalle']} ${lista_ayuda['ayuda']}`;
        //let speechText = `${lista_actividad}`;
        
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
    } catch (error) {
      console.error(error);
    }
  },
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