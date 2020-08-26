const Hapi = require('@hapi/hapi')
const Vision = require('@hapi/vision')
const Inert = require('@hapi/inert')
const Handlebars = require('handlebars')
const logger = require('pino')()
const path = require('path')
const api = require('./api.js')

const viewModel = {
  stations: [],
  error: false,
  errorMessage: 'Could not get bike stationdata. Try again'
}

async function updateStations () {
  viewModel.stations = []
  try {
    logger.info('Updating stations')
    viewModel.stations = await api.getStations()
    viewModel.error = false
  } catch (e) {
    viewModel.error = true
    logger.warn(e)
  }
}

// poll for new bike data
updateStations()
setInterval(updateStations, 10000)

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost'
  })

  await server.register(Vision)
  await server.register(Inert)

  server.views({
    engines: {
      hbs: Handlebars
    },
    relativeTo: path.join(__dirname, '../'),
    path: 'views'
  })

  server.route({
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
      directory: {
        path: path.join(__dirname, '../', 'assets'),
        listing: true
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/',
    handler: async (request, h) => {
      return h.view('main', viewModel)
    }
  })

  server.route({
    method: 'GET',
    path: '/stations',
    handler: async (request, h) => {
      return viewModel
    }
  })

  await server.start()
  logger.info('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  logger.err(err)
  process.exit(1)
})

init()
