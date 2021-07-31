import React, { useState, useEffect } from 'react'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import Pagination from '../components/Pagination'
import { getHistories, deleteHistory } from '../api/histories'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'

const HistoryScreen = () => {
  const [page, setPage] = useState(1)

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    'histories',
    () => getHistories(page),
    {
      retry: 0,
    }
  )

  const {
    isLoading: isLoadingDeleteHistory,
    isError: isErrorDeleteHistory,
    error: errorDeleteHistory,
    isSuccess: isSuccessDeleteHistory,
    mutateAsync: deleteHistoryMutateAsync,
  } = useMutation(['deleteHistory'], deleteHistory, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['histories']),
  })

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteHistoryMutateAsync(id)))
  }

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('histories')
    }
    refetch()
  }, [page, queryClient])
  return (
    <div className='container'>
      <Pagination data={data} setPage={setPage} />
      <div className='d-flex justify-content-between align-items-center'>
        <h3 className=''>Patient Histories</h3>
        <Link
          to='/history/form'
          className='btn btn-primary border-0 text-light shadow-0'
        >
          <FaPlus className='mb-1' />
        </Link>
      </div>
      {isSuccessDeleteHistory && (
        <Message variant='success'>
          History has been deleted successfully.
        </Message>
      )}
      {isErrorDeleteHistory && (
        <Message variant='danger'>{errorDeleteHistory}</Message>
      )}
      {isLoading ? (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      ) : isError ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <div className='table-responsive '>
            <table className='table table-sm hover bordered striped caption-top '>
              <caption>{data && data.total} records were found</caption>
              <thead>
                <tr>
                  <th>PATIENT ID</th>
                  <th>NAME</th>
                  <th>GENDER</th>
                  <th>AGE</th>
                  <th>MOBILE</th>
                  <th>DOCTOR</th>
                  <th>DATE</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.data.map((history) => (
                    <tr key={history._id}>
                      <td>{history.patient.patientId}</td>
                      <td>{history.patient.patientName}</td>
                      <td>{history.patient.gender}</td>
                      <td>{history.patient.age}</td>
                      <td>{history.patient.mobile}</td>
                      {/* <td>{history.createdBy.name}</td> */}
                      <td>{moment(history.createdAt).format('llll')}</td>

                      <td className='btn-group'>
                        <Link
                          to={`/history/form/${history._id}`}
                          className='btn btn-primary btn-sm border-0 shadow-0 text-light'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </Link>

                        <button
                          className='btn btn-danger btn-sm ms-1'
                          onClick={() => deleteHandler(history._id)}
                          disabled={isLoadingDeleteHistory}
                        >
                          {isLoadingDeleteHistory ? (
                            <span className='spinner-border spinner-border-sm' />
                          ) : (
                            <span>
                              {' '}
                              <FaTrash className='mb-1' /> Delete
                            </span>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default HistoryScreen
