// UI comp
const startBtn = document.createElement("button");
startBtn.innerHTML = "Start listening";
const result = document.createElement("div");
const processing = document.createElement("p");
document.body.append(startBtn);
document.body.append(result);
document.body.append(processing);

// speech to text
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let toggleBtn = null;
if (typeof SpeechRecognition === "undefined") {
    startBtn.remove();
    result.innerHTML = "<b>Browser does not support Speech API. Please download latest chrome.<b>";
} else {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onresult = event => {
        const last = event.results.length - 1;
        const res = event.results[last];
        const text = res[0].transcript;
        if (res.isFinal) {
            processing.innerHTML = "processing ....";
            
            const response = process(text);
            const p = document.createElement("p");
            p.innerHTML = `You said: ${text} </br>Alexa said: ${response}`;
            processing.innerHTML = "";
            result.appendChild(p);

            // read it out
            speechSynthesis.speak(new SpeechSynthesisUtterance(response));
        } else {
            processing.innerHTML = `listening: ${text}`;
        }
    }
    let listening = false;
    toggleBtn = () => {
        if (listening) {
            recognition.stop();
            startBtn.textContent = "Start listening";
        } else {
            recognition.start();
            startBtn.textContent = "Stop listening";
        }
        listening = !listening;
    };
    startBtn.addEventListener("click", toggleBtn);

}

// processor
function process(rawText) {
    let text = rawText.replace(/\s/g, "");
    //let text = rawText
    text = text.toLowerCase();
    let response = null;
    
    const jokes = [
        'What kind of music do bunnies like best? Answer: Hip Hop!',
        'Why are cricket stadiums so cool? Answer: Because every seat has a fan in it!',
        'Why did the banker switch careers? Answer: She lost interest',
        'What do you call a rose that wants to go to the moon? Answer: Gulab Ja Moon',
        'What is orange and sounds like a parrot? Answer: A carrot'
    ];
    
    if(text.includes("hello")){
        response = "hi, how are you doing?";
    }
    else if(text.includes("name")){
        response = "My name's Alexa.";
    }
    else if(text.includes("howareyou")){
        response = "I'm good.";
    }
    else if(text.includes("fine")){
        response = "good.";
    }
    else if(text.includes("good")){
        response = "great.";
    }
    else if(text.includes("weather")){
        response = "The weather is humid";
    }
    else if(text.includes("time")){
        response = new Date().toLocaleTimeString();
    }
    else if(text.includes("joke")){
        response = jokes[Math.floor(Math.random()*jokes.length)];
    }
    else if(text.includes("play")){
        window.open(`https://www.youtube.com/results?search_query=${rawText.replace("Play", "")}`, "_blank");
        const txt = rawText.replace("Play", "");
        response = "playing" + txt;
    }
    else if(text.includes("stop") || text.includes("exit")){
        response = "Bye!!";
        toggleBtn();
    }

    if (!response) {
        window.open(`http://google.com/search?q=${rawText.replace("Search", "")}`, "_blank");
        return `I found some information for ${rawText}`;
    }

   if(!text || text.length === 0 ){
        response = "No voice commmand detected";
    }

    return response;
}
