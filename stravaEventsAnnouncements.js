var api = require('./stravaApi');
var _ = require('underscore');
var moment = require('moment');

class StravaEventsAnnouncements  {
    constructor(code) {
        this.code = code;
    }

    async _getUserEvents(){
        let type = "events";
        return await this._getUserClubInfo(type)
    }

    async _getUserAnnouncements(){
        let type = "announcements";
        return await this._getUserClubInfo(type)
    }

    async _getUserClubInfo(type) {
        try {
            if (this.stravaUser == null) {
                this.stravaUser = new api.StravaApi(this.code);
            }

            let userData = await this.stravaUser.stravaGet( 'https://www.strava.com/api/v3/athlete');
            let userClubs = await userData.clubs;

            var events = [];
            var allAnnouncements = [];

            while(userClubs.length > 0){
                let club = userClubs.pop();

                if(type == "events"){
                    let clubEvents = await this._getEvents(club);
                    events = events.concat(clubEvents);
                }

                else if(type="announcements"){
                    let clubAnnouncements = await this._getAnnouncements(club);
                    allAnnouncements = allAnnouncements.concat(clubAnnouncements);
                }
            }

            if(type == "events"){
                let eventsSeparatedSorted = this.separateEvents(events);
                return eventsSeparatedSorted
            }
            else if(type == "announcements"){
                allAnnouncements = _.sortBy(allAnnouncements, 'created_at').reverse();
                return allAnnouncements
            }

            return


        } catch (err) {
            console.log(err);
        }
    };

    async _getEvents(club) {
        try{
            let url = 'https://www.strava.com/api/v3/clubs/' + club.id + '/group_events';
            let clubEvents = await this.stravaUser.stravaGet(url);
            var events = [];

            while(clubEvents.length > 0) {
                let event = clubEvents.pop();
                event['clubName'] = club.name;
                event['clubId'] = club.id;
                event['image'] = club.profile_medium;
                if(event.upcoming_occurrences.length > 0){
                    events.push(event);
                }
            }
            return events;
        }
        catch (err) {
            return [];
        }
    }

    async _getAnnouncements(club) {
        try {
            let urlAnnouncements = 'https://www.strava.com/api/v3/clubs/' + club.id + '/announcements';
            let clubAnnouncements = await this.stravaUser.stravaGet(urlAnnouncements);
            var announcements = [];

            while(clubAnnouncements.length > 0) {
                let announcement = clubAnnouncements.pop();
                announcement['clubName'] = club.name;
                announcement['clubId'] = club.id;
                announcement['image'] = club.profile_medium;
                announcement['readableDate'] = moment(announcement.created_at).format('MMMM Do YYYY, h:mma');
                announcements.push(announcement);
            }
            return announcements;
        }

        catch (err) {
            return [];
        }
    }

    separateEvents(events) {
        var eventsSeparated = [];

        _.each(events, function(event){
            _.each (event.upcoming_occurrences, function(occurrence){

                var newEvent = _.clone(event);
                newEvent['occurrence'] = occurrence;
                newEvent['readableDate'] = moment(occurrence).format('MMMM Do YYYY, h:mma');
                eventsSeparated.push(newEvent);

            })
        });

        let eventsSeparatedSorted = _.sortBy(eventsSeparated, 'occurrence');
        return eventsSeparatedSorted;
    }
}

exports.StravaEventsAnnouncements = StravaEventsAnnouncements;
