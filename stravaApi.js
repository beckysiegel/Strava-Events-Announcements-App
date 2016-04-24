var config = require('./config.js');


class StravaApi  {
    constructor(code) {
        this.code = code;
    }

    async getToken() {
        try {
            let response = await fetch('https://www.strava.com/oauth/token', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    client_id: config.client_id,
                    client_secret: config.client_secret,
                    code: this.code
                })
            });

            let responseData  =  await response.json();

            this.access_token = await responseData.access_token;

        } catch (err) {
            console.log(err)
        }

    }

    async stravaGet (url) {
        try {
            if(!this.access_token){
                await this.getToken()
            }

            let response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer '+this.access_token
                }
            });

            let responseData  =  await response.json();
            return responseData;

        } catch (err) {
            console.log(err)
        }

    }
}

exports.StravaApi = StravaApi;
