//webkitURL is deprecated but nevertheless


let inputBox = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let apiKey = '771aa8f7-d363-4ff0-a824-10181a86ac47';
let notFound = document.querySelector('.not__found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');
let wordBox = document.querySelector('.words_and_meaning');
var inputMeaning="";
var inputWord="";

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 

let constraintObj = { 
	audio: true, 
	video: false
}; 

let i=0;
//var searchValue = inputBox.value;
//let oldLength = 0;

/*var searchValue = inputBox.value;
$(function () {
    setTimeout(myFunction, 3000);
});
function myFunction(){
    var currentValue = document.getElementById("input1").value;
    if ((currentValue) && currentValue != searchValue && currentValue != '')
    {
        searchValue = $('#input1').val();
        if(i!=0)
        {
            strTosearch=searchValue.slice(searchValue.lastIndexOf(" "),searchValue.length);
        }
        else
        {
            strTosearch = searchValue;
        }
        inputBox.value = strTosearch;
        rec.exportWAV(createDownloadLink);
        
        i++;
    }
    else {
        setTimeout(myFunction, 3000);
    }
    
}

setInterval(function() { myFunction()} , 5000);


*/
var searchValue = inputWord;
$(function () {
    setTimeout(myFunction, 4000);
});

function myFunction(){
	var currentValue = document.getElementById("input1").value;
	if((currentValue) && currentValue != searchValue && currentValue != '')
	{
		searchValue1 = $('#input1').val();
		searchValue2 = $('#input2').val();
		if(i!=0)
		{
			rec.exportWAV(createDownloadLink);
			searchWord = searchValue1.slice(searchValue1.lastIndexOf(" "),searchValue1.length);
			searchMeaning = searchValue2.slice(searchValue2.lastIndexOf(" "),searchValue2.length);
		}
		else
		{
			searchWord = searchValue1;
			searchMeaning = searchValue2;
		}


		let words = document.createElement('span');
		let meanging = document.createElement('span');
		let br = document.createElement('br');
		let wordMeaningBox = document.createElement('div');

		words.classList.add('suggested');
		meanging.classList.add('meaning');
		words.innerHTML = searchWord;
		meanging.innerHTML = searchMeaning;
		//wordBox.insertBefore(words)
		
		wordMeaningBox.appendChild(words);
		wordMeaningBox.appendChild(meanging);
		wordMeaningBox.appendChild(br);

		wordBox.insertBefore(wordMeaningBox,wordBox.firstChild);
		rec.exportWAV(createDownloadLink);
		i++;

	}
	else{
		setTimeout(myFunction,3000);
	}
}

if (navigator.mediaDevices === undefined) {
	navigator.mediaDevices = {};
	navigator.mediaDevices.getUserMedia = function(constraintObj) {
		let getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		if (!getUserMedia) {
			return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
		}
		return new Promise(function(resolve, reject) {
			getUserMedia.call(navigator, constraintObj, resolve, reject);
		});
	}
}else{
	navigator.mediaDevices.enumerateDevices()
	.then(devices => {
		devices.forEach(device=>{
			console.log(device.kind.toUpperCase(), device.label);
			//, device.deviceId
		})
	})
	.catch(err=>{
		console.log(err.name, err.message);
	})
}






URL = window.URL || window.webkitURL;
	/*
			Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/
    
    var constraints = { audio: true, video:false }

 	
     
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

		var AudioContext = window.AudioContext || window.webkitAudioContext;
		var audioContext //audio context to help us record


		audioContext = new AudioContext();

		console.log("Audio context");

		//update the format 
		//document.getElementById("formats").innerHTML="Format: 1 channel pcm @ "+audioContext.sampleRate/1000+"kHz"

		/*  assign to gumStream for later use  */
		gumStream = stream;
		console.log("After gumstream");
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);
		console.log("After taking input of audio context");

		/* 
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
		rec = new Recorder(input,{numChannels:1});

        console.log("After getting recorder object");
		//start the recording process
		rec.record();

		console.log("Recording has been started");
		if(i==0)
		stopRecording(gumStream);
	}).catch(function(err) {
	  	//enable the record button if getUserMedia() fails
    	print(err)
	});




function stopRecording(gumStream) {
	console.log("stopButton clicked");

    rec.exportWAV(createDownloadLink);
}

function createDownloadLink(blob) {
	console.log("Blob object",blob);
	var url = URL.createObjectURL(blob);
	

	//name of .wav file to use during upload and download (without extendion)
	var filename = new Date().toISOString();

	
    console.log("Blob is ",blob);
    var xhr=new XMLHttpRequest();
       xhr.onload=function(e) {
            if(this.readyState === 4) {
                console.log("Server returned: ",e.target.responseText);
				result = e.target.responseText;
				pos2 = result.lastIndexOf('"');
				pos1 = result.lastIndexOf(":");
				inputWord = result.slice(pos1+3,pos2);

				pos1 = result.indexOf(":");
				pos2 = result.indexOf(",");

				inputMeaning = result.slice(pos1+3,pos2-1)
				document.getElementById("input1").value= inputWord;
				document.getElementById("input2").value= inputMeaning;


				
            }
        };
        var fd=new FormData();
        fd.append("audio_data",blob, filename);
        xhr.open("POST","/record",true);
        xhr.send(fd);


}
