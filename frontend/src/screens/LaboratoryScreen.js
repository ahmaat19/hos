import React, { useState, useEffect } from 'react'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import { FaKeyboard } from 'react-icons/fa'
import Pagination from '../components/Pagination'
import { getPatients } from '../api/patients'
import { getRequestedLab, addResults } from '../api/laboratory'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import moment from 'moment'
import { useForm } from 'react-hook-form'

const LaboratoryScreen = () => {
  const [page, setPage] = useState(1)
  const [patientId, setPatientId] = useState('')
  const [fillOut, setFillOut] = useState(null)
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {},
  })

  const queryClient = useQueryClient()

  const {
    isLoading: isLoadingGetRequestedLab,
    isError: isErrorGetRequestedLab,
    error: errorGetRequestedLab,
    isSuccess: isSuccessGetRequestedLab,
    data: dataGetRequestedLab,
    mutateAsync: getRequestedLabMutateAsync,
  } = useMutation(['getRequestedLab'], () => getRequestedLab(patientId), {
    retry: 0,
    onSuccess: () => {},
  })

  const {
    isLoading: isLoadingAddResults,
    isError: isErrorAddResults,
    error: errorAddResults,
    isSuccess: isSuccessAddResults,
    data: dataAddResults,
    mutateAsync: addResultsMutateAsync,
  } = useMutation(['addResults'], addResults, {
    retry: 0,
    onSuccess: () => {},
  })

  console.log(dataAddResults && dataAddResults)

  const { data, isLoading, isError, error } = useQuery(
    'patients',
    () => getPatients(page),
    {
      retry: 0,
    }
  )

  const formCleanHandler = () => {
    reset()
  }

  const submitHandler = (data) => {
    addResultsMutateAsync({ data, fillOut })
  }

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('patients')
    }
    refetch()
  }, [page, queryClient])

  const searchHandler = (e) => {
    e.preventDefault()
    getRequestedLabMutateAsync(patientId)
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-8 col-12'>
          <form onSubmit={(e) => searchHandler(e)} className='form-inline'>
            <div className='input-group mb-3'>
              <input
                type='text'
                className='form-control'
                placeholder='Search patient'
                aria-describedby='search'
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
              <button
                className='input-group-text btn btn-primary border-0'
                id='search'
              >
                Search
              </button>
            </div>
          </form>
        </div>
        <div className='col-md-4 col-12'>
          <Pagination data={data} setPage={setPage} />
        </div>
      </div>
      {isSuccessGetRequestedLab && (
        <Message variant='success'>Record has been found successfully.</Message>
      )}
      {isErrorGetRequestedLab && (
        <Message variant='danger'>{errorGetRequestedLab}</Message>
      )}
      {isSuccessAddResults && (
        <Message variant='success'>
          Lab result has been filled out successfully.
        </Message>
      )}
      {isErrorAddResults && (
        <Message variant='danger'>{errorAddResults}</Message>
      )}

      <div
        className='modal fade'
        id='editPatientModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editPatientModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editPatientModalLabel'>
                Fill Out Test Results
              </h3>
              <button
                type='button'
                className='btn-close'
                data-bs-dismiss='modal'
                aria-label='Close'
                onClick={formCleanHandler}
              ></button>
            </div>
            <div className='modal-body'>
              {isLoadingGetRequestedLab ? (
                <div className='text-center'>
                  <Loader
                    type='ThreeDots'
                    color='#00BFFF'
                    height={100}
                    width={100}
                    timeout={3000} //3 secs
                  />
                </div>
              ) : isErrorGetRequestedLab ? (
                <Message variant='danger'>{errorGetRequestedLab}</Message>
              ) : (
                <form onSubmit={handleSubmit(submitHandler)}>
                  {fillOut && fillOut.hematology.length > 0 && (
                    <>
                      <span className='fw-bold'>HEMATOLOGY</span>
                      <div className='row'>
                        {fillOut &&
                          fillOut.hematology.map((hematology, index) => (
                            <div key={index} className='col-md-3 col-6'>
                              <div className='mb-3'>
                                <label htmlFor={hematology}>{hematology}</label>
                                <input
                                  {...register(`hematology_${hematology}`)}
                                  type='text'
                                  placeholder='Enter patient name'
                                  className='form-control'
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  )}

                  {fillOut && fillOut.serology.length > 0 && (
                    <>
                      <span className='fw-bold'>SEROLOGY</span>
                      <div className='row'>
                        {fillOut &&
                          fillOut.serology.map((serology, index) => (
                            <div key={index} className='col-md-3 col-6'>
                              <div className='mb-3'>
                                <label htmlFor={serology}>{serology}</label>
                                <input
                                  {...register(`serology_${serology}`)}
                                  type='text'
                                  placeholder='Enter patient name'
                                  className='form-control'
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  )}

                  {fillOut && fillOut.bioChemistry.length > 0 && (
                    <>
                      <span className='fw-bold'>BIOCHEMISTRY</span>
                      <div className='row'>
                        {fillOut &&
                          fillOut.bioChemistry.map((bioChemistry, index) => (
                            <div key={index} className='col-md-3 col-6'>
                              <div className='mb-3'>
                                <label htmlFor={bioChemistry}>
                                  {bioChemistry}
                                </label>
                                <input
                                  {...register(`bioChemistry_${bioChemistry}`)}
                                  type='text'
                                  placeholder='Enter patient name'
                                  className='form-control'
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  )}

                  <div className='modal-footer'>
                    <button
                      type='button'
                      className='btn btn-secondary'
                      data-bs-dismiss='modal'
                      onClick={formCleanHandler}
                    >
                      Close
                    </button>
                    <button
                      type='submit'
                      className='btn btn-primary '
                      disabled={isLoadingAddResults}
                    >
                      {isLoadingAddResults ? (
                        <span className='spinner-border spinner-border-sm' />
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className='d-flex justify-content-between align-items-center'>
        <h3 className=''>Patients</h3>
      </div>

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
                  <th>DOCTOR</th>
                  <th>DATE & TIME</th>

                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {dataGetRequestedLab &&
                  dataGetRequestedLab.map((test) => (
                    <tr key={test._id}>
                      <td>{test.patient && test.patient.patientId}</td>
                      <td>{test.patient && test.patient.patientName}</td>
                      <td>{test.createdBy && test.createdBy.name}</td>
                      <td>
                        {moment(test.patient && test.createdAt).format('llll')}
                      </td>

                      <td className='btn-group'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => setFillOut(test)}
                          data-bs-toggle='modal'
                          data-bs-target='#editPatientModal'
                        >
                          <FaKeyboard className='mb-1' /> Fill Out
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

export default LaboratoryScreen
