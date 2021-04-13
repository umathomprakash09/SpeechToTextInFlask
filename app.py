from flask import Flask, render_template
import speech_recognition as sr
import wave
from flask import request
from os import path
import os
from PyDictionary import PyDictionary


dictionary = PyDictionary()

listener = sr.Recognizer()

app = Flask(__name__)

@app.route('/')
def hello_world():
    #return run_om()
    return render_template('index.html')


@app.route('/record',methods=['POST','GET'])
def record():
    if request.method=="POST":
        f = request.files['audio_data']
        with open('audio.wav','wb') as audio:
            f.save(audio)
        word_meaning = run_om()
        return word_meaning
    else:
        return render_template('index.html')



def take_command():
    command=""
    AUDIO_FILE = path.join(path.dirname(path.realpath(__file__)), "audio.wav")
    try:
        with sr.AudioFile(AUDIO_FILE) as source:
            audio = listener.record(source) 
            #command = listener.listen(source, phrase_time_limit=5)
            command = listener.recognize_google(audio)
            command = command.lower()
            print(command)
    except sr.UnknownValueError:
        print("Google Speech Recognition could not understand audio")
    except sr.RequestError as e:
        print("Could not request results from Google Speech Recognition service; {0}".format(e))
    return command




def run_om():
    command = take_command()
    my_dict = {}
    my_dict['word'] = command
    meaning = dictionary.meaning(command)
    print("Meaninig of "+command)
    print(meaning)
    if not bool(meaning):
        word = "Dictionary is empty"
    elif meaning is None:
        word = "Sorry No response"
    elif 'Noun' in meaning.keys():
        word = meaning['Noun'][0]
    elif 'Adjective' in meaning.keys():
        word = meaning['Adjective'][0]
    elif 'Verb' in meaning.keys():
        word = meaning['Verb'][0]
    my_dict['meaning'] = word
    return my_dict

if __name__ == "__main__":
    app.run(debug=True)
    
    