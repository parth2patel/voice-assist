// UI comp
const startBtn = document.createElement("button");
startBtn.innerHTML = "Start Listening";
const result = document.createElement("div");
const processing = document.createElement("p");
document.body.append(startBtn);
document.body.append(result);
document.body.append(processing);

// speech to text
window.SpeechRecog = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition;
let toggleBtn = null;
if (typeof window.SpeechRecog === "undefined") {
    startBtn.remove();
    result.innerHTML = "<b>Browser does not support Speech API. Please download latest chrome.<b>";
} else {
    const recognition = new window.SpeechRecog();
    recognition.continuous = true;
    
    //To detect User Device
    var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
	if (isMobile) {
  		recognition.interimResults = false;
	} else {
		recognition.interimResults = true;
	}
    //recognition.interimResults = false;
    recognition.onresult = event => {
        const last = event.results.length - 1;
        const res = event.results[last];
        const text = res[0].transcript.trim();
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
            startBtn.textContent = "Start Listening";
        } else {
            recognition.start();
            startBtn.textContent = "Stop Listening";
        }
        listening = !listening;
    };
    startBtn.addEventListener("click", toggleBtn);

}

// processor
function process(rawText) {
    const q = document.createElement("p");
    let text = rawText.replace(/\s/g, "");
    //let text = rawText
    text = text.toLowerCase();
    let response = null;
    if(!text || text.length === 0 ){
        response = "No voice commmand detected";
    }
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
	let hrs = new Date().getHours();
        let am = " PM";
        if(hrs>12){
            hrs = hrs-12;
        }
        else if(hrs==12) am = " PM";
        else am = " AM";
        response = "It's " + hrs + ":" + new Date().getMinutes() + am;
    }
    else if(text.includes("joke")){
        response = jokes[Math.floor(Math.random()*jokes.length)];
    }
    else if(text.includes("play")){
	let query = rawText.replace("Play","");
	query = query.replace("play","");
        window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
        response = "playing" + query;
    }
    else if(text.includes("stop") || text.includes("exit") || text.includes("bye")){
        response = "Bye!";
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
