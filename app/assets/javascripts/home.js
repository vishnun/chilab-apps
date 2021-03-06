$(function () {

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

                var wordDict = {};
                topicsData[key].forEach(function (word) {
                    wordDict[word] = true;
                });

                self.topics.push(new Topic(key, wordDict));
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

    function setupDialogs(dialogs) {
        dialogs.forEach(function (dialog) {
            if (!dialog.showModal) {
                dialogPolyfill.registerDialog(dialog);
            }

            dialog.querySelector('.close').addEventListener('click', function () {
                dialog.close();
            });
        });

    }

    var User = function (name) {
        this.name = name;
    };

    var Dialogue = function (user, sentence, wordDetected) {
        this.user = user;
        this.sentence = sentence;
        this.wordDetected = wordDetected;
    };

    var SmartConversation = function () {
        var self = this;

        var setupDialog = document.querySelector('dialog#setup-dialog');
        var transcriptDialog = document.querySelector('dialog#transcript-dialog');

        if (!setupDialog || !transcriptDialog) {
            return;
        }

        setupDialogs([setupDialog, transcriptDialog]);
        self.dialogues = ko.observableArray([]);
        function showDialogues() {
            $.ajax({
                url: "/dialogues",
                data: {
                    transcript: {
                        id: self.selectedTranscriptId()
                    }
                }
            }).done(function (data) {
                data.forEach(function (d) {
                    self.dialogues.push(new Dialogue(d.user, d.sentence, d.word_detected));
                });
            });
        }

        self.showDialog = function (dialogType) {
            if (dialogType == 'setup') {
                setupDialog.showModal();
            }
            if (dialogType == 'transcript') {
                transcriptDialog.showModal();
                showDialogues()
            }
        };

        self.selectedTopic = ko.observable({name: 'Topic', words: ['none']});

        var defaultLanguage = new Language('en-US');
        self.languages = ko.observableArray([defaultLanguage, new Language('en-GB'), new Language('en-IN'), new Language('en-CA'), new Language('en-AU'), new Language('en-NZ'), new Language('en-ZA')]);
        self.selectedLanguage = ko.observable(defaultLanguage);

        self.timeout = ko.observable(5);
        self.conversation = ko.observable(getCoversation(self));

        self.finishSetup = function () {
            setupProblemDocument();
        };

        self.selectedTranscriptId = ko.observable();

        self.post_dialogue = function (sentence, wordsDetected) {
            var $transcriptEl = $('#transcript');
            var selected = $transcriptEl.find('option:selected');

            $.ajax({
                url: "/dialogue",
                method: 'post',
                data: {
                    dialogue: {
                        transcript_id: selected.val(),
                        user: self.selectedUser().name,
                        sentence: sentence,
                        word_detected: wordsDetected.join(" - ")
                    }
                }
            })
        };

        self.showWord = function (words) {
            var snackbarContainer = document.querySelector('#word-toast'),
                data = {
                    message: words.join(", "),
                    timeout: self.timeout() * 1000
                };
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        };

        self.users = ko.observableArray([]);
        self.selectedUser = ko.observable({name: '', words: []});

        self.updateWords = function () {
            var $selectedTopicEl = $('#selected_topic');
            var selected = $selectedTopicEl.find('option:selected');
            $.ajax({
                url: "/topic/" + selected.val(),
                context: document.body
            }).done(function (topic) {
                var wordDict = {};
                topic.words.forEach(function (word) {
                    wordDict[word] = true;
                });
                self.selectedTopic({name: topic.name, words: wordDict});
            });
        };

        self.updateUsers = function () {
            var $transcriptEl = $('#transcript');
            var selected = $transcriptEl.find('option:selected');
            self.selectedTranscriptId(selected.val());
            $.ajax({
                url: "/transcript_users",
                context: document.body,
                data: {
                    transcript: {
                        id: selected.val()
                    }
                }
            }).done(function (users) {
                self.users([]);
                users.forEach(function (userName) {
                    self.users.push(new User(userName));
                });
                self.selectedUser(self.users()[0]);
            });
        };


        self.updateUsers();
        self.updateWords();
    };

    ko.applyBindings(new SmartConversation());

});
