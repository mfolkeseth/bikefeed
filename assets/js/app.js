/* global fetch, DocumentFragment */

const error = document.getElementById('error')
const lastUpdateText = document.getElementById('lastUpdateText')
const bikeList = document.getElementById('bikeList')

let listRendered = bikeList.childElementCount > 0

function generateStationTag (station) {
  const li = document.createElement('li')
  li.id = `station-${station.id}`

  const itemRowName = document.createElement('div')
  itemRowName.classList.add('item-row')
  const name = document.createElement('span')
  name.classList.add('name')
  name.textContent = station.name
  itemRowName.appendChild(name)

  const itemRowBikes = document.createElement('div')
  itemRowBikes.classList.add('item-row')
  const bikeSr = document.createElement('span')
  bikeSr.classList.add('sr-only')
  bikeSr.textContent = 'Tilgjengelige sykler:'
  const bikeImg = document.createElement('img')
  bikeImg.classList.add('bike-icon')
  bikeImg.alt = ''
  bikeImg.src = '/assets/icons/bicycle.svg'
  const bikeText = document.createElement('span')
  bikeText.textContent = station.numBikesAvailable
  itemRowBikes.appendChild(bikeSr)
  itemRowBikes.appendChild(bikeImg)
  itemRowBikes.appendChild(bikeText)

  const itemRowDocks = document.createElement('div')
  itemRowDocks.classList.add('item-row')
  const dockSr = document.createElement('span')
  dockSr.classList.add('sr-only')
  dockSr.textContent = 'Tilgjengelige låser:'
  const dockIcon = document.createElement('span')
  dockIcon.classList.add('dock-icon')
  dockIcon.setAttribute('aria-hidden', true)
  const dockText = document.createElement('span')
  dockText.textContent = station.numDocksAvailable
  itemRowDocks.appendChild(dockSr)
  itemRowDocks.appendChild(dockIcon)
  itemRowDocks.appendChild(dockText)

  li.appendChild(itemRowName)
  li.appendChild(itemRowBikes)
  li.appendChild(itemRowDocks)

  return li
}

function renderStations (stations) {
  const fragment = new DocumentFragment()
  stations.forEach(station => {
    fragment.appendChild(generateStationTag(station))
  })
  bikeList.appendChild(fragment)
  listRendered = true
}

function updateStationData (stations) {
  stations.forEach(station => {
    const stationToUpdate = bikeList.querySelector(`#station-${station.id}`)
    const stationRows = stationToUpdate.getElementsByTagName('div')

    const bicycleRow = stationRows[1]
    const bicycleNumber = bicycleRow.getElementsByTagName('span')[1]
    bicycleNumber.textContent = station.numBikesAvailable

    const dockRow = stationRows[2]
    const dockNumber = dockRow.getElementsByTagName('span')[2]
    dockNumber.textContent = station.numDocksAvailable
  })
}

function toggleError (toggleOn) {
  if (toggleOn) {
    error.classList.remove('error--hide')
    error.classList.add('error--show')
  } else {
    error.classList.remove('error--show')
    error.classList.add('error--hide')
  }
}

function updateTimestamp (timestamp) {
  lastUpdateText.textContent = timestamp
}

function updateStations () {
  console.info('Updating stations')
  fetch('/stations')
    .then(res => res.json())
    .then(json => {
      toggleError(json.error)

      if (listRendered) {
        updateStationData(json.stations) // avoid re-rendering the whole list
      } else {
        if (json.stations.length > 0) { // in case server does not have stations in memory on request
          renderStations(json.stations)
        }
      }

      updateTimestamp(json.lastUpdateText)
    })
    .catch((e) => {
      console.warn('Unable to reach app server', e)
    })
}

setInterval(updateStations, 2000)
