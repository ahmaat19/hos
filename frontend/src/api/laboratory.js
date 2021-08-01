import axios from 'axios'

const config = () => {
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${
        localStorage.getItem('userInfo') &&
        JSON.parse(localStorage.getItem('userInfo')).token
      }`,
    },
  }
}

export const getRequestedLab = async (id) => {
  try {
    const { data } = await axios.get(`/api/laboratory/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const addResults = async (obj) => {
  try {
    const { data } = await axios.post(`/api/laboratory`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const getLaboratory = async (id) => {
  try {
    const { data } = await axios.get(`/api/laboratory/edit/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateResults = async (obj) => {
  try {
    const { data } = await axios.put(`/api/laboratory`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
