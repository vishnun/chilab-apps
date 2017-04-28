var getCoversation = function ($parent) {
    var self = this;
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
    var speechRecognitionList = new SpeechGrammarList();
    var recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    // recognition.interimResults = false;
    // recognition.maxAlternatives = 1;
    self.started = false;
    self.timeoutObj = null;
    self.restartTimeoutObj = null;

    self.startStop = ko.observable('Start');

    self.restart = function () {
        console.log("restarting...");
        self.stopRecognition();
        setTimeout(function () {
            self.startRecognition();
        }, 1000);
    };

    self.startRecognition = function () {
        recognition.lang = $parent.selectedLanguage().name;
        self.started = true;
        recognition.start();
        self.timeoutObj = setTimeout(function () {
            self.restart();
        }, 15000);
    };

    self.stopRecognition = function () {
        console.log("Stopping now..");
        self.started = false;
        clearTimeout(self.timeoutObj);
        recognition.stop();
    };

    var matchWords = function (sentence) {
        var words = $parent.selectedTopic().words;
        var wordsInSentence = sentence.toLowerCase().split(" ");
        var wordsFound = [];
        wordsInSentence.forEach(function (word) {
            if (words[word]) {
                wordsFound.push(word);
            }
        });
        return wordsFound;
    };

    function processResult(event) {
        var last = event.results.length - 1;
        var lastSentence = event.results[last][0].transcript;
        if (event.results[last].isFinal) {
            var resultingWords = matchWords(lastSentence);
            $parent.post_dialogue(lastSentence, resultingWords);
            if (resultingWords.length > 0) {
                $parent.showWord(resultingWords);
            }
        }
    }

    recognition.onresult = function (event) {
        processResult(event);
    };

    recognition.onend = function () {
        console.log('Speech recognition service disconnected');
        if (self.started) {
            console.log("connecting again..");
            self.restart();
        }
    };

    recognition.onaudiostart = function () {
        console.log('Audio capturing started');
    };
    recognition.onaudioend = function () {
        console.log('Audio capturing ended');
        if (self.started) {
            console.log("connecting again..");
            self.restart();
        }
    };

    recognition.onspeechend = function () {
        console.log('Speech has stopped being detected');
        if (self.started) {
            console.log("connecting again..");
            self.restart();
        }
    };

    recognition.onerror = function (event) {
        console.log('Speech recognition error detected: ' + event.error);
        if (self.started) {
            console.log("connecting again..");
            self.restart();
        }
    };

    recognition.onspeechstart = function () {
        console.log('Speech has been detected');
    };

    self.toggleConversation = function () {
        if (self.started) {
            console.log("stopping..");
            self.startStop("Start");
            self.stopRecognition();
        } else {
            console.log("starting..");
            self.startStop("Stop");
            self.startRecognition();
        }
    };

    return {
        startRecognition: self.startRecognition,
        stopRecognition: self.stopRecognition,
        toggleStatus: self.toggleConversation
    };
};
