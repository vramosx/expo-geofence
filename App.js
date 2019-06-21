import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { MapView } from 'expo';
import Geofence from 'react-native-expo-geofence';

var fakePoints = [
  { key: 1, latitude: -23.633936, longitude: -46.642025, title: 'Itaú CEIC' },
  { key: 2, latitude: -23.636056, longitude: -46.644846, title: 'Temakão' },
  { key: 3, latitude: -23.636705, longitude: -46.641212, title: "McDonald's" },
  { key: 4, latitude: -23.660944, longitude: -46.664030, title: "Correios" },
]

export default class App extends React.Component {

  region = {
    latitude: -23.629893,
    longitude: -46.639663,
    latitudeDelta: 0.0171,
    longitudeDelta: 0.0108
  };

  constructor()
  {
    super();
    Geofence.Log = true;

    this.state = {
      distance: 700,
      showCircle: true,
      markers: []
    }

    console.disableYellowBox = true;
  }

  componentDidMount()
  {
     var markers = Geofence.filterByProximity(this.region, fakePoints, this.state.distance/1000);
     this.setState({ markers });
  }

  handleDecrease()
  {
    if(this.state.distance == 700)
    {
      this.changeDistance(500);
    }
    else if(this.state.distance == 1000)
    {
      this.changeDistance(700);
    }
    else if(this.state.distance == 5000)
    {
      this.changeDistance(1000);
    }
  }

  handleIncrease()
  {
    if(this.state.distance == 500)
    {
      this.changeDistance(700);
    }
    else if(this.state.distance == 700)
    {
      this.changeDistance(1000);
    }
    else if(this.state.distance == 1000)
    {
      this.changeDistance(5000);
    }
  }

  changeDistance(value)
  {
    var _this = this;
    this.setState({ distance: value, showCircle: false }, function() {
      var markers = Geofence.filterByProximity(_this.region, fakePoints, _this.state.distance/1000);
      _this.setState({ markers: markers, showCircle: true });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={this.region}
        >
        {
          this.state.showCircle ?
          <MapView.Circle
            center={this.region}
            radius={this.state.distance}
            strokeColor='transparent'
            fillColor="rgba(0, 100, 180, 0.2)"/> : null
        }
        <MapView.Marker
            coordinate={this.region}
            title="me"
            description={null}>
            <View style={styles.meStyle}/>
        </MapView.Marker>
        {this.state.markers.map((marker, index) => (
          <MapView.Marker
            key={index}
            coordinate={marker}
            title={marker.title}
            description={null}
          />
        ))}
      </MapView>
      <View style={styles.controlsContainer}>
          <TouchableOpacity onPress={this.handleDecrease.bind(this)} style={styles.button}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.distanceText}>{
            this.state.distance > 999 ?
            this.state.distance/1000 + " KM" :
            this.state.distance + ' m'
          }</Text>
          <TouchableOpacity onPress={this.handleIncrease.bind(this)} style={styles.button}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
      </View>
    </View>
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  distanceText: {
    flex: 3,
    textAlign: 'center',
    color: '#FFF'
  },
  buttonText: {
    color: '#FFF',
    fontSize: 30
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  meStyle: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: "#67c0ff",
    opacity: 0.8,
    borderWidth: 2,
    borderColor: '#dbdbdb'
  },
  map: {
    width: '100%',
    height: '100%'
  }
});