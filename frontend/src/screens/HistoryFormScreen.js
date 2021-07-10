import { FaArrowAltCircleLeft } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Message from '../components/Message'
import {
  updateHistory,
  addHistory,
  getPatientHistoryDetail,
} from '../api/histories'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const HistoryFormScreen = () => {
  const { id } = useParams()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    'history',
    () => getPatientHistoryDetail(id && id),
    {
      retry: 0,
    }
  )

  const {
    isLoading: isLoadingAddHistory,
    isError: isErrorAddHistory,
    error: errorAddHistory,
    isSuccess: isSuccessAddHistory,
    mutateAsync: addHistoryMutateAsync,
  } = useMutation(['addHistory'], addHistory, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['histories'])
    },
  })

  const {
    isLoading: isLoadingUpdateHistory,
    isError: isErrorUpdateHistory,
    error: errorUpdateHistory,
    isSuccess: isSuccessUpdateHistory,
    mutateAsync: updateHistoryMutateAsync,
  } = useMutation(['updateHistory'], updateHistory, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['histories'])
    },
  })

  const submitHandler = (data) => {
    id
      ? updateHistoryMutateAsync({
          _id: id,
          gender: data.gender,
          mobile: data.mobile,
          historyName: data.historyName,
          age: data.age,
        })
      : addHistoryMutateAsync(data)
  }
  return (
    <div className='container'>
      <div className='d-flex justify-content-between align-items-center'>
        <Link
          to='/history'
          className='btn btn-primary border-0 text-light shadow-0 btn-sm'
        >
          <FaArrowAltCircleLeft className='mb-1' /> Go Back To Histories
        </Link>
        <h5 className=''>
          {id ? 'Edit Patient History' : 'Take New Patient History'}
        </h5>
      </div>
      {id && id}
    </div>
  )
}

export default HistoryFormScreen
