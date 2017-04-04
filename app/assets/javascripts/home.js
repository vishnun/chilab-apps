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
        self.started = false;
        self.timeoutObj = null;

        self.startStop = ko.observable('Start');


        self.startRecognition = function () {
            recognition.lang = $parent.selectedLanguage().name;
            recognition.start();
        };

        self.stopRecognition = function () {
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

        self.toggleConversation = function () {
            if (self.started) {
                console.log("stopping..");
                self.startStop("Start");
                self.stopRecognition();
                self.started = false;
            } else {
                console.log("starting..");
                self.startStop("Stop");
                self.startRecognition();
                self.started = true;
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


    var SmartConversation = function () {
        var self = this;

        self.topics = ko.observableArray([]);
        self.selectedTopic = ko.observable();
        setupTopics(self);

        var defaultLanguage = new Language('en-US');
        self.languages = ko.observableArray([defaultLanguage, new Language('en-GB'), new Language('en-IN'), new Language('en-CA'), new Language('en-AU'), new Language('en-NZ'), new Language('en-ZA')]);
        self.selectedLanguage = ko.observable(defaultLanguage);

        self.timeout = ko.observable(5);
        self.transcript = ko.observableArray([]);

        self.conversation = ko.observable(getCoversation(self));


        self.finishSetup = function () {
            var document_url = $('#problem').find('option:selected').val();
            var context = {url: document_url};
            var source = $("#document-template").html();
            var template = Handlebars.compile(source);
            var html = template(context);
            var $documentContainer = $('.document-container');
            $documentContainer.html(html);
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
