const fetch = require('node-fetch')

const fetchOptions = {
  headers: {
    'Client-Identifier': 'mfolkeseth-bikefeed'
  }
}

async function getStationInfo () {
  return fetch('https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json', fetchOptions)
    .then(res => res.json())
}

async function getStationStatus () {
  return fetch('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json', fetchOptions)
    .then(res => res.json())
}

async function getStations () {
  const promises = await Promise.all([getStationInfo(), getStationStatus()])
  const stationInfoRaw = promises[0]
  const stationStatusRaw = promises[1]
  const stations = stationInfoRaw.data.stations.map(station => {
    const stationInfo = stationStatusRaw.data.stations.find(stationStatus => stationStatus.station_id === station.station_id)
    return {
      name: station.name,
      numBikesAvailable: stationInfo.num_bikes_available,
      numDocksAvailable: stationInfo.num_docks_available
    }
  })
  return stations
}

module.exports = {
  getStations
}
