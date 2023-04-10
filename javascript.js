/*
}
const consultas = [
    consulta("¿Cual es su mascota?",animals),
    consulta("¿Cual es el temañao de su mascota?",tamaño),
    consulta("¿En que etapa de vida se encuentra su mascota?",edad),
    consulta("¿Que mordida tiene su mascota?",mordida),
    consulta("¿Que linea de alimento prefiere para su macota",Linea),
    consulta("¿Cuanta cantidad desea comprar?",Cantidad),
]

*/


const answerButtonContainer = document.getElementById('answer-button-c');

class Answer {
    constructor(answer, image) {
        this.answer = answer;
        this.image = image;
    }
}

class Node {
    constructor(question, answers, prop, children) {
        this.question = question;
        this.answers = answers;
        this.prop = prop;
        this.children = children;
    }
}

class DecisionTree {
    constructor(root) {
        this.root = root;
        this.currentNode = root;
    }

    moveToChild(answer) {
        if (this.currentNode.children && this.currentNode.children[answer]) {
            this.currentNode = this.currentNode.children[answer];
            return true;
        }
        return false;
    }

    getCurrentQuestion() {
        return this.currentNode.question;
    }

    getCurrentAnswers() {
        return this.currentNode.answers;
    }

    getCurrentProp() {
        return this.currentNode.prop;
    }
}

const compra = {

};
const cleanAnswers = () => {
    answerButtonContainer.innerHTML = "";
};

const setQuestion = (decisionTree) => {
    document.getElementById("questionText").innerText = decisionTree.getCurrentQuestion();
};

const setAnswers = (decisionTree) => {
    decisionTree.getCurrentAnswers().forEach((e) => {
        answerButtonContainer.appendChild(createButton(e, (answer) => onClickAnswer(answer, decisionTree)));
    });
};

const onClickAnswer = (response, decisionTree) => {
    console.log(response);
    compra[decisionTree.getCurrentProp()] = response;
    const moved = decisionTree.moveToChild(response);
    cleanAnswers();
    if (moved) {
        init(decisionTree);
    } else {
        // Aquí puedes realizar alguna acción cuando se alcance una hoja del árbol, como enviar un mensaje de WhatsApp.
    }
};

const generateMessageWsp = () => {
  let msj = "OTROS";
  if (compra.animal !== "Otros") {
    msj = `¡Hola!  Estoy buscando alimento para mi ${compra.animal}. Es de tamaño ${compra.tam} y se encuentra en etapa ${compra.edad}.¿Tienen disponible en bolsas de ${compra.cant}? Gracias :)`;
  }

  return msj;
};
const sendMessageWsp  = () => {

    
        var numeroTelefono = "1212121221"; // Reemplaza con el número de teléfono al que deseas enviar el mensaje
        var mensajePredeterminado = generateMessageWsp();
        var mensajeCodificado = encodeURIComponent(mensajePredeterminado);
        var enlaceWhatsApp = `https://wa.me/${numeroTelefono}?text=${mensajeCodificado}`;

        window.open(enlaceWhatsApp, "_blank");


}

const createButton = (e, onClickCallback) => {
    const button = document.createElement("button");
    button.placeholder = e.answer;
    button.innerText = e.answer;
    //button.style.backgroundImage = `url(${e.image})`;
    button.style.width = "14vw";
    button.style.height = "28vh";
    button.style.backgroundSize = "cover";
    button.style.backgroundPosition = "left";
    button.classList.add("answer-button");
    button.onclick = () => onClickCallback(e.answer);
    return button;
};

async function loadConfig() {
    const response = await fetch('./config/config.json');
    const config = await response.json();

    const questionMap = new Map();

    console.log("Abc")
    console.log(config)
    config.questions.forEach(q => {
        const answers = q.answers.map(a => new Answer(a.answer, a.image));
        const children = {};

        q.answers.forEach(a => {
            if (a.next) {
                children[a.answer] = null; // se llenará más adelante
            }
        });

        questionMap.set(q.id, new Node(q.question, answers, q.id, children));
    });

    config.questions.forEach(q => {
        q.answers.forEach(a => {
            if (a.next) {
                questionMap.get(q.id).children[a.answer] = questionMap.get(a.next);
            }
        });
    });

    const decisionTree = new DecisionTree(questionMap.get(config.root));
    return decisionTree;
}


const init = (decisionTree) => {
    setQuestion(decisionTree);
    setAnswers(decisionTree);
};

(async () => {
    const decisionTree = await loadConfig();
    init(decisionTree);
})();