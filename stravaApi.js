const config = require('./config.js');

class StravaApi {
  constructor(code) {
    this.code = code;
  }

  async getToken() {
    try {
      const response = await fetch('https://www.strava.com/oauth/token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: config.client_id,
          client_secret: config.client_secret,
          code: this.code,
        }),
      });

      const responseData = await response.json();
      this.access_token = await responseData.access_token;
    } catch (err) {
      return;
    }
  }

  async stravaGet(url) {
    try {
      if (!this.access_token) {
        await this.getToken();
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.access_token}`,
        },
      });

      const responseData = await response.json();
      return responseData;
    } catch (err) {
      return { error: err };
    }
  }

  async deauthorize() {
    try {
      const response = await fetch('https://www.strava.com/oauth/deauthorize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.access_token}`,
        },
      });
      return response;
    } catch (err) {
      return { error: err };
    }
  }
}

exports.StravaApi = StravaApi;
