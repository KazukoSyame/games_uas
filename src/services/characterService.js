import api from './api'



export const getCharacters = async () => {
  try {
    const response = await api.get('/characters')
    return response.data
  } catch (error) {
    console.error('Error fetching characters:', error)
    throw error
  }
}