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
