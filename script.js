const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

const recognition = new SpeechRecognition();

recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

//LOGIN AND AUTHENTICATION
const phone = document.querySelector("#phone");
const otp_btn = document.querySelector("#otp-btn");
const otp = document.querySelector("#otp");
const login = document.querySelector("#login"); //this is the login button
const login_container = document.querySelector(".login"); //this is the UI of the login page
const left = document.querySelector(".left");
const convoId = 1;

otp_btn.onclick = () => {

    if(phone.value.length != 10){
        alert("Please enter a valid phone number");
        phone.value = "";
        return;
    }

    otp_btn.style.display = "none";
    phone.style.display = "none";
    otp.style.display = "flex";
    login.style.display = "flex";

    fetch("http://localhost:5500/api/v1/sendotp", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "http://127.0.0.1:5500"
        },
        body: JSON.stringify({
            phone: phone.value,
            convoId: convoId
        })
    })
    .then((response) => console.log(response))
    .catch((error) => console.log(error));

}

login.onclick = () => {

    if(otp.value.length != 6){
        alert("Please enter a valid OTP");
        otp.value = "";
        return;
    }

    fetch("http://localhost:5500/api/v1/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            phone: phone.value,
            otp: otp.value,
        })
    })
    .then((response) => response.json())
    .then((data) => {
        if(data.success){
            login_container.style.display = "none";
            decision.style.display = "flex";
            const chatHistory = data.chatHistory;
            console.log(data);
            console.log(chatHistory);


            const history = document.querySelector(".history");

            console.log("fetching chat history");
            chatHistory.forEach( (conversation) => {
                const prevChat = document.createElement("div");
                prevChat.id = conversation.id;
                prevChat.className = "prev-chat";
                prevChat.innerHTML = conversation.messages[0].question;
                history.appendChild(prevChat);

                prevChat.onclick = () => {
                    console.log("clicked");
                    const convoId = prevChat.id;
                    fetch("http://localhost:5500/api/v1/getConversation", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            convoId: convoId
                        })
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        const messages = data.messages;
                        console.log(messages);
                        })
                    .catch((error) => console.log(error));
                }
            });
        }
        else{
            alert(data.message);
            otp.value = "";
        }
    })

}


// DECISION PART variables
const ask_btn = document.querySelector("#ask-btn");
const type_btn = document.querySelector("#type-btn");
const decision = document.querySelector(".decision");
const ask = document.querySelector(".ask");
const type = document.querySelector(".type");

// ASK PART variables
const eng_btn = document.querySelector("#eng-btn");
const hindi_btn = document.querySelector("#hindi-btn");
const punjabi_btn = document.querySelector("#punjabi-btn");
const urdu_btn = document.querySelector("#urdu-btn");
const pashto_btn = document.querySelector("#pashto-btn");
const sindhi_btn = document.querySelector("#sindhi-btn");

const selectLang = document.querySelector(".selectLang");

const rec_btn = document.querySelector("#rec-btn");

//CHANGING LANGUAGES

eng_btn.onlclick = () => {
    eng_btn.style.backgroundColor = "blue";
    // recognition.lang = "en-US";
    // alert("English language selected");
    console.log("English language selected");
    selectLang.style.display = "none";
}

hindi_btn.onclick = () => {
    recognition.lang = "hi-IN";
    alert("आपने हिंदी भाषा का चयन किया है");
    selectLang.style.display = "none";
}

punjabi_btn.onclick = () => {
    recognition.lang = "pa-IN";
    alert("ਤੁਸੀਂ ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਦੀ ਚੋਣ ਕੀਤੀ ਹੈ");
    selectLang.style.display = "none";
}

urdu_btn.onclick = () => {
    recognition.lang = "ur-PK";
    alert("آپ نے اردو زبان کا انتخاب کیا ہے");
    selectLang.style.display = "none";
}

pashto_btn.onclick = () => {
    recognition.lang = "ps-AF";
    alert("تاسو پښتو ژبې د ټاکنې انتخاب کړی");
    selectLang.style.display = "none";
}

sindhi_btn.onclick = () => {
    recognition.lang = "sd-PK";
    alert("توهان سنڌي ٻولي جي انتخاب ڪيل آهيو");
    selectLang.style.display = "none";
}

//DONE CHANGING LANGUAGES


//  DECISION PART BUTTON HANDLERS

ask_btn.onclick = () => {
    decision.style.display = "none";
    ask.style.display = "flex";
    type.style.display = "none";
    left.style.display = "flex";
}

type_btn.onclick = () => {
    decision.style.display = "none";
    type.style.display = "flex";
    ask.style.display = "none";
    left.style.display = "flex";
}

//LEFT PART HANDLERS AND FETCHING HISTORY

// const prevChat = document.querySelectorAll(".prev-chat");


// prevChat.onclick = () => {
//     console.log("clicked");
//     const cId = prevChat.id;
//     fetch("http://localhost:5500/api/v1/getConversation", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             convoId: cId
//         })
//     })
//     .then((response) => response.json())
//     .then((data) => {
//         console.log(data);
//     })
// }

console.log("fetching chat history")
const prevChats = document.querySelectorAll(".prev-chat");
console.log("heres the chats", prevChats);

prevChats.forEach( (prevChat) => {
    prevChat.addEventListener("click", () => {
        console.log("clicked");
        const cId = conversation.id;
        fetch("http://localhost:5500/api/v1/getConversation", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                convoId: cId
            })
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })
    })
})



//ASK PART BUTTON HANDLERS

const question = document.querySelectorAll(".question");
const answer = document.querySelectorAll(".answer");

rec_btn.onclick = () => {
    recognition.start();
}

recognition.onresult = async (event) => {
    const result = await event.results[0][0].transcript;
    question.textContent = `Me: ${result}`;
};

/*GENERAL FUNCTION FOR API CALL*/

const conversation = document.querySelector(".conversation");
const conversation2 = document.querySelector(".conversation2");
let convocount = 0;

async function getResponse() {

    API_KEY = "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";

    const options = {
        method: "POST",
        headers: {
            'authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "assistant", content: "You are a helpul AI assistant."},
                {role: "user", content: question.textContent}
            ],
            max_tokens: 150,
            convoid: convocount
        })
    }

    try{
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json();

        //conversation mechanism in ASK PART
        const questionElement = document.createElement("div");
        questionElement.className = "question";
        questionElement.textContent = `${question.textContent}`;
        conversation.appendChild(questionElement);

        const answerElement = document.createElement("div");
        answerElement.className = "answer";
        answerElement.textContent = data.choices[0].message.content;
        conversation.appendChild(answerElement);

        //conversation mechanism in TYPE PART
        const q = document.createElement("div");
        q.className = "q";
        q.textContent = `Me: ${question.textContent}`;
        conversation2.appendChild(q);

        const a = document.createElement("div");
        a.className = "a";
        a.textContent = data.choices[0].message.content;
        conversation2.appendChild(a);

        //Updating history:
        const history = document.querySelector(".history");
        const prevChat = document.createElement("div");
        prevChat.className = "prev-chat";
        prevChat.textContent = question.textContent;
        history.appendChild(prevChat);


        
    }
    catch(err){
        console.log(err);
    }

}

recognition.onspeechend = () => {
    recognition.stop();

    /*setTimeout(() => {
    getResponse();
    }, 1000);*/

    fetch("https://localhost:5500/api/v1/getresponse", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            question: question.textContent,
        })
    })
    .then(response => response.json())
    .then(data => {

        const questionElement = document.createElement("div");
        questionElement.className = "question";
        questionElement.textContent = `${question.textContent}`;
        conversation.appendChild(questionElement);

        const answerElement = document.createElement("div");
        answerElement.className = "answer";
        answerElement.textContent = data.choices[0].message.content;
        conversation.appendChild(answerElement);

    })
    .catch( (err) => {console.log(err);
    alert("Error occurred: " + err);
    });



}

//error handling

recognition.onerror = (event) => {
    alert( "Error occurred in recognition: " + event.error);
};

/* TYPE PART BUTTON HANDLERS */

const query = document.querySelector("#text-input");
const submit_btn = document.querySelector("#submit-btn");
const q = document.querySelector("#q");
const a = document.querySelector("#a");


submit_btn.onclick = async () => {
    if(query.value){
        question.textContent = query.value;

        //getResponse();

        fetch("http://localhost:5500/api/v1/getresponse", {
            credentials: 'include',
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: question.textContent,
            })
        })
        // .then(response => response.json())
        .then(data => { 
                const q = document.createElement("div");
                q.className = "q";
                q.textContent = `Me: ${question.textContent}`;
                conversation2.appendChild(q);
    
                const a = document.createElement("div");
                a.className = "a";
                a.textContent = data;
                conversation2.appendChild(a);
        })
        .catch(err => console.log(err));

    }
    else
    {
        alert("Please enter a query");
    }
    // q.textContent = `Me: ${query.value}`;

}



