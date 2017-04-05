$(function () {
    var dialog = document.querySelector('dialog');
    var showDialogButton = document.querySelector('#show-dialog');
    if (!dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    showDialogButton.addEventListener('click', function () {
        dialog.showModal();
    });
    dialog.querySelector('.close').addEventListener('click', function () {
        dialog.close();
    });

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
            for (var index in words) {
                var word = words[index];
                if (wordsInSentence.includes(word)) {
                    return word;
                }
            }
            return false;
        };

        function processResult(event) {
            var dataItem = {};
            var last = event.results.length - 1;
            var lastSentence = event.results[last][0].transcript;
            if (event.results[last].isFinal) {
                // view.checkWords(lastSentence);
                // view.addToTranscript(lastSentence);
                var resultingWord = matchWords(lastSentence);
                console.log(resultingWord, lastSentence);
                if (resultingWord) {
                    $parent.showWord(resultingWord);
                    var date = new Date(event.timeStamp);
                    dataItem.word = resultingWord || "";
                    dataItem.sentence = lastSentence;
                    dataItem.date = date.toGMTString();
                    dataItem.timestamp = event.timeStamp;
                    dataItem = {};
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


    var Topic = function (name, words) {
        this.name = name;
        this.words = words;
    };

    var Language = function (name) {
        this.name = name;
    };

    function setupTopics(self) {
        var topicsData = window.lcl.topics;
        for (var key in topicsData) {
            if (topicsData.hasOwnProperty(key)) {
                self.topics.push(new Topic(key, topicsData[key]));
            }
        }
    }


    function setupProblemDocument() {
        var document_url = $('#problem').find('option:selected').val();
        var context = {url: document_url};
        var source = $("#document-template").html();
        var template = Handlebars.compile(source);
        var html = template(context);
        var $documentContainer = $('.document-container');
        $documentContainer.html(html);
    }

    var SmartConversation = function () {
        var self = this;

        self.topics = ko.observableArray([]);
        setupTopics(self);
        self.selectedTopic = ko.observable(self.topics()[1]);

        var defaultLanguage = new Language('en-US');
        self.languages = ko.observableArray([defaultLanguage, new Language('en-GB'), new Language('en-IN'), new Language('en-CA'), new Language('en-AU'), new Language('en-NZ'), new Language('en-ZA')]);
        self.selectedLanguage = ko.observable(defaultLanguage);

        self.timeout = ko.observable(5);
        self.transcript = ko.observableArray([]);

        self.conversation = ko.observable(getCoversation(self));


        self.finishSetup = function () {
            setupProblemDocument();
        };

        self.showWord = function (word) {
            var snackbarContainer = document.querySelector('#word-toast'),
                data = {
                    message: word,
                    timeout: self.timeout() * 1000
                };
            console.log(self.timeout());
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        };

    };

    ko.applyBindings(new SmartConversation());

});
