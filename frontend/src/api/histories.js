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

export const getHistories = async () => {
  try {
    const { data } = await axios.get(`/api/histories`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const getPatientHistoryDetail = async (id) => {
  try {
    const { data } = await axios.get(`/api/histories/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const addHistory = async (obj) => {
  try {
    const { data } = await axios.post(`/api/histories`, obj, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const updateHistory = async (obj) => {
  try {
    const { data } = await axios.put(
      `/api/histories/${obj._id}`,
      obj.reqObj,
      config()
    )
    return data
  } catch (error) {
    throw error.response.data.message
  }
}

export const deleteHistory = async (id) => {
  try {
    const { data } = await axios.delete(`/api/histories/${id}`, config())
    return data
  } catch (error) {
    throw error.response.data.message
  }
}
