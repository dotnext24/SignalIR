/// <reference path="jquery.signalR-1.0.0-rc1.js" />

$(function () {
    function personViewModel(id, firstName, lastName, email, owner) {
        this.id = id;
        this.firstName = ko.observable(firstName);
        this.lastName = ko.observable(lastName);
        this.email = ko.observable(email);
        this.removePerson = function () {
            owner.deletePerson(this.id)
        }

        var self = this;

        this.firstName.subscribe(function (newValue) {
            owner.updatePerson(ko.toJS(self));
        });

        this.lastName.subscribe(function (newValue) {
            owner.updatePerson(ko.toJS(self));
        });

        this.email.subscribe(function (newValue) {
            owner.updatePerson(ko.toJS(self));
        });
    }

    function peopleViewModel() {
        this.hub = $.connection.personHub;
        this.people = ko.observableArray([]);
        this.newPersonFirstName = ko.observable();
        this.newPersonLastName = ko.observable();
        this.newPersonEmail = ko.observable();
        var people = this.people;
        var self = this;
        var notify = true;

        this.init = function () {
            this.hub.server.getAll();
        }

        this.hub.client.allPeopleRetrieved = function (allPeople) {
            var mappedPeople = $.map(allPeople, function (person) {
                return new personViewModel(person.Id, person.FirstName,
                    person.LastName, person.Email, self)
            });

            people(mappedPeople);
        }

        this.hub.client.personUpdated = function (updatedPerson) {
            var person = ko.utils.arrayFilter(people(),
                function(value) {
                    return value.id == updatedPerson.Id;
                })[0];
            notify = false;
            person.firstName(updatedPerson.FirstName);
            person.lastName(updatedPerson.LastName);
            person.email(updatedPerson.Email);
            notify = true;
        };

        this.hub.client.raiseError = function (error) {
            $("#error").text(error);
        }

        this.hub.client.personCreated = function (newPerson) {
            people.push(new personViewModel(newPerson.Id, newPerson.FirstName, newPerson.LastName,
                newPerson.Email, self));
        };

        this.hub.client.personRemoved = function (id) {
            var person = ko.utils.arrayFilter(people(), function(value) {
                return value.id == id;
            })[0];
            people.remove(person);
        }

        this.createPerson = function () {
            var person = { firstName: this.newPersonFirstName(), lastname: this.newPersonLastName(), email: this.newPersonEmail() };
            this.hub.server.add(person).done(function () {
                console.log('Person saved!');
            }).fail(function (error) {
                console.warn(error);
            });
            this.newPersonEmail('');
            this.newPersonFirstName('');
            this.newPersonLastName('');
        }
       
        this.deletePerson = function (id) {
            this.hub.server.delete(id);
        }

        this.updatePerson = function (person) {
            if (notify) {
                this.hub.server.update(person);
            }
        }
    }

    var viewModel = new peopleViewModel();
    ko.applyBindings(viewModel);

    $.connection.hub.start(function () {
        viewModel.init();
    });
});