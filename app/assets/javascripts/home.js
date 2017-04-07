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

    var SmartConversation = function () {
        var self = this;

        var setupDialog = document.querySelector('dialog#setup-dialog');
        var transcriptDialog = document.querySelector('dialog#transcript-dialog');
        setupDialogs([setupDialog, transcriptDialog]);

        self.showDialog = function (dialogType) {
            if (dialogType == 'setup') {
                setupDialog.showModal();
            }
            if (dialogType == 'transcript') {
                transcriptDialog.showModal();
            }
        };

        self.topics = ko.observableArray([]);
        setupTopics(self);
        self.selectedTopic = ko.observable(self.topics()[1]);

        var defaultLanguage = new Language('en-US');
        self.languages = ko.observableArray([defaultLanguage, new Language('en-GB'), new Language('en-IN'), new Language('en-CA'), new Language('en-AU'), new Language('en-NZ'), new Language('en-ZA')]);
        self.selectedLanguage = ko.observable(defaultLanguage);

        self.timeout = ko.observable(5);
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

        self.users = ko.observableArray([]);

        self.updateUsers = function () {
            var $transcriptEl = $('#transcript');
            var selected = $transcriptEl.find('option:selected');
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
            });
        };

        self.selectedUser = ko.observable();
        self.updateUsers();
    };

    ko.applyBindings(new SmartConversation());

});
