const api = require('./stravaApi');
const _ = require('underscore');
const moment = require('moment');

class StravaEventsAnnouncements {
  constructor(code) {
    this.code = code;
  }

  async getUserEvents() {
    const type = 'events';
    return await this.getUserClubInfo(type);
  }

  async getUserAnnouncements() {
    const type = 'announcements';
    return await this.getUserClubInfo(type);
  }

  async getUserClubInfo(type) {
    try {
      if (this.stravaUser === undefined) {
        this.stravaUser = new api.StravaApi(this.code);
      }

      const userData = await this.stravaUser.stravaGet('https://www.strava.com/api/v3/athlete');
      const userClubs = await userData.clubs;

      let events = [];
      let allAnnouncements = [];

      while (userClubs.length > 0) {
        const club = userClubs.pop();

        if (type === 'events') {
          const clubEvents = await this.getEvents(club);
          events = events.concat(clubEvents);
        } else if (type === 'announcements') {
          const clubAnnouncements = await this.getAnnouncements(club);
          allAnnouncements = allAnnouncements.concat(clubAnnouncements);
        }
      }

      if (type === 'events') {
        const eventsSeparatedSorted = this.separateEvents(events);
        return eventsSeparatedSorted;
      } else if (type === 'announcements') {
        allAnnouncements = _.sortBy(allAnnouncements, 'created_at').reverse();
        return allAnnouncements;
      }
      return [];
    } catch (err) {
      return [];
    }
  }

  async getEvents(club) {
    try {
      const url = `https://www.strava.com/api/v3/clubs/${club.id}'/group_events`;
      const clubEvents = await this.stravaUser.stravaGet(url);
      const events = [];

      while (clubEvents.length > 0) {
        const event = clubEvents.pop();
        event.clubName = club.name;
        event.clubId = club.id;
        event.image = club.profile_medium;
        if (event.upcoming_occurrences.length > 0) {
          events.push(event);
        }
      }
      return events;
    } catch (err) {
      return [];
    }
  }

  async getAnnouncements(club) {
    try {
      const urlAnnouncements = `https://www.strava.com/api/v3/clubs/${club.id}'/announcements`;
      const clubAnnouncements = await this.stravaUser.stravaGet(urlAnnouncements);
      const announcements = [];

      while (clubAnnouncements.length > 0) {
        const announcement = clubAnnouncements.pop();
        announcement.clubName = club.name;
        announcement.clubId = club.id;
        announcement.image = club.profile_medium;
        announcement.readableDate = moment(announcement.created_at).format('MMMM Do YYYY, h:mma');
        announcements.push(announcement);
      }
      return announcements;
    } catch (err) {
      return [];
    }
  }

  separateEvents(events) {
    const eventsSeparated = [];
    _.each(events, event => {
      _.each(event.upcoming_occurrences, occurrence => {
        const newEvent = _.clone(event);
        newEvent.occurrence = occurrence;
        newEvent.readableDate = moment(occurrence).format('MMMM Do YYYY, h:mma');
        eventsSeparated.push(newEvent);
      });
    });

    const eventsSeparatedSorted = _.sortBy(eventsSeparated, 'occurrence');
    return eventsSeparatedSorted;
  }
}

exports.StravaEventsAnnouncements = StravaEventsAnnouncements;
