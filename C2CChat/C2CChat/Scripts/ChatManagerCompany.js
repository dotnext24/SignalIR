/// <reference path="jquery.signalR-1.0.0-rc1.js" />

$(function () {

    //jquery
    $(".onlineUser").click(function () {
        alert("");
    });

    //new
    function onlineViewModel(id, name) {
        this.id = id;
        this.name = ko.observable(name);
        var self = this;


         this.hub = $.connection.chatHub;
        this.message = ko.observableArray([]);
        //new
        this.newChatUserID = ko.observable();
        var newChatUserID=this.newChatUserID;
        this.getFromOnline = function (id) {
            newChatUserID = id;
            $('#ChatUserID').val(id)
            alert(newChatUserID);
            this.hub.client.chatMessageRetrieved = function (allMessage) {
                var mappedMessage = $.map(allMessage, function (message) {
                    if (message.ChatUserID == $('#ChatUserID').val())
                        return new chatMessageViewModel(message.ID, message.Message,
                            message.RepliedBy, message.ChatUserID, message.Date, self)
                });

                message(mappedMessage);
            }

            console.log('Person selected!' + id);
        }

        
    }
    

    function chatMessageViewModel(id, message, repliedBy, chatUserID, date, owner) {
        this.id = id;
        this.message = ko.observable(message);
        this.repliedBy = ko.observable(repliedBy);
        this.chatUserID = ko.observable(chatUserID);
        this.date = ko.observable(date);
        this.removeChatMessage = function () {
            owner.deleteMessage(this.id)
        }

        var self = this;

        this.message.subscribe(function (newValue) {
            owner.updateMessage(ko.toJS(self));
        });

        this.repliedBy.subscribe(function (newValue) {
            owner.updateMessage(ko.toJS(self));
        });

        this.chatUserID.subscribe(function (newValue) {
            owner.updateMessage(ko.toJS(self));
        });
        this.date.subscribe(function (newValue) {
            owner.updateMessage(ko.toJS(self));
        });
    }

    function messageViewModel() {
        this.hub = $.connection.chatHub;
        this.message = ko.observableArray([]);

        //new
        this.online = ko.observableArray([]);
        var online = this.online;
       


        this.newMessageMessage = ko.observable();
        this.newMessageRepliedBy = ko.observable();
        this.newMessageChatUserID = $('#ChatUserID').val();
        this.newMessageDate = ko.observable();
        var message = this.message;
        var self = this;
        var notify = true;

        this.init = function () {
            this.hub.server.getAll();
        }


        //new
        this.init = function () {
            this.hub.server.getOnline();
        }
        this.hub.client.onlineUserRetrieved = function (allonline) {
            var mappedMessage = $.map(allonline, function (online) {
                return new onlineViewModel(online.ID, online.UserName,
                         self)
            });

            online(mappedMessage);
        }


        


        this.hub.client.chatMessageRetrieved = function (allMessage) {
            var mappedMessage = $.map(allMessage, function (message) {
                if (message.ChatUserID == $('#ChatUserID').val())
                    return new chatMessageViewModel(message.ID, message.Message,
                        message.RepliedBy, message.ChatUserID, message.Date, self)
            });

            message(mappedMessage);
        }






        this.hub.client.chatMessageRetrieved = function (allMessage) {
            var mappedMessage = $.map(allMessage, function (message) {
                if (message.ChatUserID == $('#ChatUserID').val())
                    return new chatMessageViewModel(message.ID, message.Message,
                        message.RepliedBy, message.ChatUserID, message.Date, self)
            });

            message(mappedMessage);
        }

        
        

        this.hub.client.chatMessageUpdated = function (updatedMessage) {
            var msg = ko.utils.arrayFilter(message(),
                function (value) {
                    return value.id == updatedMessage.ID;
                })[0];
            notify = false;
            msg.message(updatedMessage.Message);
            msg.repliedBy(updatedMessage.RepliedBy);
            msg.chatUserID(updatedMessage.ChatUserID);
            msg.date(updatedMessage.Date);
            notify = true;
        };

        this.hub.client.raiseError = function (error) {
            $("#error").text(error);
        }

        this.hub.client.messageCreated = function (newMessage) {
            message.push(new chatMessageViewModel(newMessage.ID, newMessage.Message, newMessage.RepliedBy,
                newMessage.ChatUserID, newMessage.Date, self));
        };

        this.hub.client.messageRemoved = function (id) {
            var msg = ko.utils.arrayFilter(message(), function (value) {
                return value.id == id;
            })[0];
            message.remove(msg);
        }

        this.createMessage = function () {
            
            var msg = { message: this.newMessageMessage(), repliedBy: 'abc', chatUserID: $('#ChatUserID').val(), date: new Date() };
            this.hub.server.add(msg).done(function () {
                console.log('Person saved!');
            }).fail(function (error) {
                console.warn(error);
            });
            this.newMessageMessage('');
            this.newMessageRepliedBy('');

            this.newMessageDate('');
        }

        this.deleteMessage = function (id) {
            this.hub.server.delete(id);
            console.log('Person deleted!');
        }

        this.updateMessage = function (message) {
            if (notify) {
                this.hub.server.update(message);
            }
        }

       


        this.testMessage = function (d, e) {
            if (e.keyCode === 13)
            {
                var msg = { message: $('#Message').val(),  chatUserID: $('#ChatUserID').val(), date: new Date() };

                this.hub.server.add(msg).done(function () {
                    console.log('Person saved!');
                }).fail(function (error) {
                    console.warn(error);
                });
                this.newMessageMessage('');
                this.newMessageRepliedBy('');

                this.newMessageDate('');
                $('#Message').val('');
                return false;
            }
            return true;
        };

       
    }

    var viewModel = new messageViewModel();
    ko.applyBindings(viewModel);
   
    $.connection.hub.start(function () {
        viewModel.init();
        
    });
});