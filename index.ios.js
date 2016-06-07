/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
    AppRegistry,
    Component,
    Image,
    ListView,
    RefreshControl,
    StyleSheet,
    Text,
    View,
    Linking,
    TouchableNativeFeedback,
    TouchableHighlight,
    TabBarIOS,
    AsyncStorage
} from 'react-native';

import SafariView from "react-native-safari-view";

var config = require('./config.js');
var stravaEventsAnnouncements = require('./stravaEventsAnnouncements');

function stravaOauth () {

  url = [
    'https://www.strava.com/oauth/authorize',
    '?response_type=code',
    '&client_id=' + config.client_id,
    '&redirect_uri=http://whosriding.beckysiegel.com/'
  ].join('');

  console.log(url);

  SafariView.show({
    url: url
  });
}

var base64CalIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAC/UlEQVR4Xu2d4XETQQxGpU5IBUAHpAM6ASohlEIH6YCkAuhEzM44MHFsK99K8eacl7/Wau/eW2mdS+bWjZ+lBHzp7ExuCFi8CBCAgMUEFk9PBSBgMYHF01MBly4gIuLUPbr70kWw+vpe/OZX32C2wFdfHwIWVygCEMAekLXJ0uere2x28auvjxZEC6IFZVV68vOIeGdmX8zsk5l9KCXbzuA7M7s1sx/u/qdy2aUWFBHfzexr5QIuYOyNu3+bvY9pARHx6w2t+IzvrbtfZ0GHPp8SEBE3u7YzM+eljhntSO4GsoBdz/99qRSL93Wl7gkzAlj9xy3JVTAjgN5/XMCdu39UqmhGwMnHy8rklxirPl5HQPMqQEAzUDUdAlRizfEIaAaqpkOASqw5HgHNQNV0CFCJNccjoBmomg4BKrHmeAQ0A1XTIUAl1hyPgGagarrlAtQLUG9wdXz3v7G0P4xDgPZfHggQS4oKEIF1hyOgm6iYDwEisO5wBHQTFfMhQATWHY6AbqJiPgSIwLrDEdBNVMyHABFYdzgCuomK+RAgAusOR0A3UTEfAkRg3eEI2COaAVEFZI/Ts/my8fvXs/nH0RkQBKgExHgE7AFTS1Dk/SQcAQh4REBdgOwB4gLKKg4BxZ6WAUQAX0Nf1zvgshWpFgQVIBJDgLiJiXzTcAQggK+haZkIAewBAqwRSguiBdGCxKI5GU4LEmnSgmhBtCCxaGhBncBoQYtbUKfM5+TKhGeb+P4cm/97wHOgdcYgoJPmRC4ETEDrHIKATpoTuRAwAa1zCAI6aU7kQsAEtM4hr15A581uMdc5fg8Yhxe83yKcM1zzvbtLh1jM/CLGy7uPmzzLy7vHkSW8vv6whJd/ff2YlwMcDtKXV//IIregh6kjgr3gv4ef7v55Zo+ZFkAl/MM9tfIfRpcE7CSMPWGcnTKOsXor347ud8dYjROU1h1jNVNyjHlMoFwBAK0RQECNX3k0AsoIawkQUONXHo2AMsJaAgTU+JVHI6CMsJbgL4lYcn81XBSbAAAAAElFTkSuQmCC';
var base64NotifyIcon = 'data:image/png;base64,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';
var arrowIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAEDUlEQVR4Xu3dTW7TQBiH8X/3IHaIIyAugPhYglj2AkhcB3Ga7oBV10jAVYAbINOYpm1qv7ZnkvfjYcs0yszzyzj1JOqZ+Fd6Bc5Kz57JCwDFEQAAAMVXoPj02QEAUHwFik/f6w7wTNInSe8l/S7eqOv0PQIY4l9Keizpu6S3IOhnwBuA/fjjrEHQr7+r+wCH4oOgY/zhob3sAFPxQdARgRcAF5LODfPkcmBYpCVDvAB4KOmrpBeGJw8CwyJZh3gBMDxfEFirNRznCQAIGoa1PpQ3ACCwlms0ziMAEDSKa3kYrwBAYKnXYIxnACBoEHjuIbwDAMFcwY3/HwEACDZGnvrxKACWIvgh6Q2niPNyIgEAwXzPxSOiAQDB4sTTPxARwIjgi6SXhvXgcjCxSFEBgMAg3zIkMgAQWArPjIkOAAQbEWQAAIINCLIAAMFKBJkAgGAFgmwAQLAQQUYAIFiAICsAEBgRZAawBsHwNbRfxrVLMSw7ABAUuBFkeSUOHzlfcnZQZieosAOMQAYEnyW9MogZDpBKIKgEYLwcgGDvFVANAAhubX8VAYCg+A7AewIA/F+B8m8Mq14C9q+EpREA4IpCWQQAuN4LSiIAwM1fi8ohAMDd24KlEADg8H3hJQh+7r6GFvIUEQD3HwyUQACA6ZOhB7tTRMsBUsidAADzR4OpEQBgHsAwIi0CANgApEUAADuAlAgAsAxAOgQAWA4gFQIArAOQBgEA1gNIgQAA2wCERwCA7QBCIwBAGwBhEQCgHYARwfC9g9eGh3VxdgAAQ6kFQx7t/vTNc8PPfJP0TtIfw9huQwDQbmnDxR+mDoA2AELGB0Dx+ADYDiDsK3+cOpeA9QjCx2cHKB4fAOsApHjlcwkg/r8V4D2AHUKqVz47gD38MDJlfHYAG4K08QEwDyB1fABMA0gfHwD3AygRHwCHAZSJD4C7AErFB8BNAOXiA+AaQMn4ALgCUDY+AIrHrw6g9Cu/+lkA8XcCKp4GEn/vt59qAIh/695HJQDEP3DnswoA4t9z7lEBAPEnTj2zAyD+zGceMgMg/vwHXtJ+KJT4hvhZ7wQS3xg/IwDiL4ifDQDxF8bPBID4K+JnAUD8lfEzACD+hvjRARB/Y/zIAIjfIH5UAMRvFD8iAOI3jB8NAPEbx48EgPgd4kcBQPxO8SMAIH7H+N4BEL9zfM8AiH+E+F4BEP9I8T0CIP4R43sDQPwjx/cEgPgniO8JwIWkc8MauPgzK4bnGWaIl4+FP5V0KenJxMoRvwMrLwCGqU0hIH6H+J4uAeP0DiEgfqf4HgHc3gmI3zG+VwAjgo+SPpz67+p1Xv+TP7yn9wAnX4yKTwAAFavvzRkAACi+AsWnzw4AgOIrUHz67ADFAfwFMRtUkM7VPxMAAAAASUVORK5CYII=";

class StravaEvents extends Component {
  constructor(props) {
    super(props);
    this.renderEvent = this.renderEvent.bind(this);
    this.renderAnnouncement = this.renderAnnouncement.bind(this);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      dataSource2: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }),
      loaded: false,
      refreshing: false,
      loggedin: false
    };
  }

  _onRefreshEvents() {
    this.setState({refreshing: true});
    this.getEventsAnnouncements("events").then(() => {
      this.setState({refreshing: false});
    });
  }

  _onRefreshAnnouncements() {
    this.setState({refreshing: true});
    this.getEventsAnnouncements("announcements").then(() => {
      this.setState({refreshing: false});
    });
  }

  componentDidMount() {
    AsyncStorage.getItem("code").then((value) => {
      this.setState({"code": value});
      this.code = value;

      if (value != null) {
        this.setState({"loggedin": true});

        this.stravaEventsAnnouncements = new stravaEventsAnnouncements.StravaEventsAnnouncements(this.code, AsyncStorage);

        this.getEventsAnnouncements("events");
        this.getEventsAnnouncements("announcements", true);
      }

      var url = Linking.addEventListener('url', this._handleOpenURL.bind(this));

    }).done();
  };

  async getEventsAnnouncements(type, skipShow) {
    if (type == "events") {

      let events = await this.stravaEventsAnnouncements._getUserEvents();

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(events),
        loaded: true,
        selectedTab: 'blueTab'
      });
    }
    else if(type == "announcements") {
      let announcements = await this.stravaEventsAnnouncements._getUserAnnouncements();

      var selectedTab;

      if(!skipShow){
        selectedTab = 'redTab';
      } else {
        selectedTab = 'blueTab';
      }

      this.setState({
        dataSource2: this.state.dataSource.cloneWithRows(announcements),
        loaded: true,
        selectedTab: selectedTab
      });
    }
  }

  async _handleOpenURL(event) {
    try {
      var code = event.url.split('?code=');
      AsyncStorage.setItem("code", code[1]);

      if(!code[1]) {
        return
      }

      AsyncStorage.setItem("code", code[1]);
      this.setState({
        loggedin: true
      });

      this.code = code[1];

      this.stravaEventsAnnouncements = new stravaEventsAnnouncements.StravaEventsAnnouncements(this.code, AsyncStorage);

      this.getEventsAnnouncements("events");

    }

    catch (err) {
      console.log(err);
    }

  };

  _renderEvents () {
      return (
          <View style={styles.container}>
            <Text style={styles.pageTitle}>Events</Text>
            <ListView
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefreshEvents.bind(this)}
                  />
                }
                dataSource={this.state.dataSource}
                renderRow={this.renderEvent}
                loadData={this.reloadEvents}
                style={styles.listView}
            />
          </View>
      );
  }

  _renderAnnouncements () {
    return (
      <View style={styles.container}>
        <Text style={styles.pageTitle}>Announcements</Text>
        <ListView
            refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefreshAnnouncements.bind(this)}
                  />
                }
            dataSource={this.state.dataSource2}
            renderRow={this.renderAnnouncement}
            loadData={this.reloadAnnouncements}
            style={styles.listView}
        />
      </View>
    );
  }


  render() {
    if (!this.state.loggedin) {
      return this.renderLoginView();
    }

    else if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <TabBarIOS
          tintColor="white"
          barTintColor="#333">
        <TabBarIOS.Item
            title="Events"
            icon={{uri: base64CalIcon, scale: 3}}
            selected={this.state.selectedTab === 'blueTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'blueTab'
              });
            }}>
          {this._renderEvents()}
        </TabBarIOS.Item>
        <TabBarIOS.Item
            title="Announcements"
            icon={{uri: base64NotifyIcon, scale: 3}}
            badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
            selected={this.state.selectedTab === 'redTab'}
            onPress={() => {
              this.setState({
                selectedTab: 'redTab',
                notifCount: this.state.notifCount + 1
              });
            }}>
          {this._renderAnnouncements()}
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }

  reloadEvents() {
    // returns a Promise of reload completion
    // for a Promise-free version see ControlledRefreshableListView below
    return this.getEventsAnnouncements("events");
  }

  reloadAnnouncements() {
    // returns a Promise of reload completion
    // for a Promise-free version see ControlledRefreshableListView below
    return this.getEventsAnnouncements("announcements");
  }

  renderLoginView() {
    return (
        <View style={styles.container}>
          <Text style={styles.pageTitle}>Welcome!</Text>

          <Text  style={styles.welcomeMessage}>
            Login or create an account with Strava:
          </Text>

          <View style={styles.loginContainer}>

            <TouchableHighlight  style={styles.loginButton} underlayColor={'#fff'} onPress={()=> stravaOauth()}>
                <Image source={require('./images/ConnectWithStrava@2x.png')} />
            </TouchableHighlight>
            <TouchableHighlight style={styles.loginButton} underlayColor={'#fff'} onPress={()=> this.handleClick(`https://www.strava.com/register/free`)}>
                <Text>
                  Create New Account
                </Text>
            </TouchableHighlight>
          </View>
        </View>
    );
  }

  renderLoadingView() {
    return (
        <View style={styles.loadingContainer}>
          <Text>
            Loading events...
          </Text>
        </View>
    );
  }

  handleClick(url) {
    SafariView.show({
      url: url
    });
  }

  renderEvent(event) {
    var  image = event.image;

    return (
      <TouchableHighlight underlayColor={'#fff'} onPress={()=> this.handleClick(`https://www.strava.com/clubs/${event.clubId}/group_events/${event.id}`)}>
        <View style={styles.eventRow}>
          <Image style={styles.icon} source={{uri:image}} />
          <View style={styles.eventDetails}>
            <Text style={styles.date}>{event.readableDate}</Text>
            <Text style={styles.club}>{event.clubName}</Text>
            <Text style={styles.info}>{event.title}</Text>
          </View>
          <Image style={styles.base64} source={{uri: arrowIcon, scale: 1}} />
        </View>
      </TouchableHighlight>
    );
  }

  renderAnnouncement(event) {
    var  image = event.image;
    return (
      <View style={styles.eventRow}>
        <Image style={styles.icon} source={{uri:image}} />
        <View style={styles.eventDetails}>
          <Text style={styles.date}>{event.readableDate}</Text>
          <Text style={styles.club}>{event.clubName}</Text>
          <Text style={styles.info}>{event.message}</Text>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20
  },
  container: {
    flex: 1
  },
  containerItem: {
    padding:10,
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1,
    justifyContent: 'flex-end'
  },
  eventRow: {
    flexDirection: 'row',
    padding:10,
    borderBottomColor: '#D3D3D3',
    borderBottomWidth: 1
  },
  eventDetails:{
    flex: 6
  },
  thumbnail: {
    width: 53,
    height: 81
  },
  rightContainer: {
    flex: 1
  },
  title: {
    fontSize: 20,
    textAlign: 'center'
  },
  pageTitle: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#FC4C02',
    color: 'white',
    fontSize: 18
  },
  info: {
    textAlign: 'left',
    fontSize: 12
  },
  club: {
    textAlign: 'left',
    color: '#666666',
    marginBottom: 5
  },
  date: {
    textAlign: 'left',
    fontWeight: 'bold'
  },
  link: {
    color: '#FC4C02'
  },
  listView: {
  },
  tabContent: {
    flex: 1,
    alignItems: 'center'
  },
  tabText: {
    color: 'white',
    margin: 50
  },
  base64: {
    flex: 1,
    height: 30,
    resizeMode: 'contain',
    justifyContent: 'flex-end',
    alignSelf: 'center'
  },
  icon: {
    flex: 1,
    height: 50,
    resizeMode: 'contain',
    marginRight: 10,
    marginLeft: 10
  },
  welcomeMessage: {
    margin: 20
  },
  loginContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 50
  },
  loginButton: {
    margin: 10
  }
});


AppRegistry.registerComponent('StravaEventCalendar', () => StravaEvents);
