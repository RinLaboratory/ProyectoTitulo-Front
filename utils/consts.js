import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

export const URL = publicRuntimeConfig.BACKEND_URL || 'http://localhost:3000'