const REQUEST_CONFIG = {
    protocol: 'http',
    host: 'localhost',
    port: 8000,
    prefix: '/api'
}

// const URL_BASE = `${REQUEST_CONFIG.protocol}://${REQUEST_CONFIG.host}:${REQUEST_CONFIG.port}${REQUEST_CONFIG.prefix}`
const URL_BASE = `${REQUEST_CONFIG.prefix}`

export { REQUEST_CONFIG, URL_BASE }
