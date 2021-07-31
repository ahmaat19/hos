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

export const getLabRequests = async () => {
  try {
    const { data } = await axios.get(`/api/lab-requests`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const addLabRequest = async (obj) => {
  try {
    const { data } = await axios.post(`/api/lab-requests`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateLabRequest = async (obj) => {
  try {
    const { data } = await axios.put(
      `/api/lab-requests/${obj._id}`,
      obj,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const deleteLabRequest = async (id) => {
  try {
    const { data } = await axios.delete(`/api/lab-requests/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const getPatients = async () => {
  try {
    const { data } = await axios.get(`/api/lab-requests/patients`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
