/* global fetch, DocumentFragment */

const error = document.getElementById('error')
const bikeList = document.getElementById('bikeList')

function removeStations () {
  while (bikeList.firstChild) {
    bikeList.removeChild(bikeList.firstChild)
  }
}

function generateStation (station) {
  const li = document.createElement('li')

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

function appendStations (stations) {
  const fragment = new DocumentFragment()
  stations.forEach(station => {
    fragment.appendChild(generateStation(station))
  })
  bikeList.appendChild(fragment)
}

function updateStations () {
  console.info('Updating stations')
  fetch('/stations')
    .then(res => res.json())
    .then(json => {
      removeStations()
      if (json.error) {
        error.classList.remove('error--hide')
        error.classList.add('error--show')
      } else {
        error.classList.remove('error--show')
        error.classList.add('error--hide')
      }
      appendStations(json.stations)
    })
}

setInterval(updateStations, 10000)
