import React, { useState, useEffect, useRef } from 'react'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import { FaKeyboard, FaPlus } from 'react-icons/fa'
import Pagination from '../components/Pagination'
import { getPatients, updatePatient, addPatient } from '../api/patients'
import { getRequestedLab } from '../api/laboratory'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import moment from 'moment'
import { useForm } from 'react-hook-form'

const LaboratoryScreen = () => {
  const [page, setPage] = useState(1)
  const [patientId, setPatientId] = useState('')
  const [fillOut, setFillOut] = useState(null)
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
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

  const { data, isLoading, isError, error } = useQuery(
    'patients',
    () => getPatients(page),
    {
      retry: 0,
    }
  )

  const {
    isLoading: isLoadingUpdatePatient,
    isError: isErrorUpdatePatient,
    error: errorUpdatePatient,
    isSuccess: isSuccessUpdatePatient,
    mutateAsync: updatePatientMutateAsync,
  } = useMutation(['updatePatient'], updatePatient, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['patients'])
    },
  })

  const {
    isLoading: isLoadingAddPatient,
    isError: isErrorAddPatient,
    error: errorAddPatient,
    isSuccess: isSuccessAddPatient,
    mutateAsync: addPatientMutateAsync,
  } = useMutation(['addPatient'], addPatient, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['patients'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  const submitHandler = (data) => {
    // edit
    //   ? updatePatientMutateAsync({
    //       _id: id,
    //       gender: data.gender,
    //       mobile: data.mobile,
    //       patientName: data.patientName,
    //       age: data.age,
    //     })
    //   : addPatientMutateAsync(data)
    console.log(data)
  }

  const editHandler = (patient) => {
    setId(patient._id)
    setEdit(true)
    setValue('patientName', patient.patientName)
    setValue('gender', patient.gender)
    setValue('mobile', patient.mobile)
    setValue('age', patient.age)
  }

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('patients')
    }
    refetch()
  }, [page, queryClient])

  const inputEl = useRef(null)
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
      {isSuccessUpdatePatient && (
        <Message variant='success'>
          Patient has been updated successfully.
        </Message>
      )}
      {isErrorUpdatePatient && (
        <Message variant='danger'>{errorUpdatePatient}</Message>
      )}
      {isSuccessAddPatient && (
        <Message variant='success'>Patient has been Addd successfully.</Message>
      )}
      {isErrorAddPatient && (
        <Message variant='danger'>{errorAddPatient}</Message>
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
                                  {...register(`hematology-${hematology}`)}
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
                                  {...register(`serology-${serology}`)}
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
                                  {...register(`bioChemistry-${bioChemistry}`)}
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
                      disabled={isLoadingAddPatient || isLoadingUpdatePatient}
                    >
                      {isLoadingAddPatient || isLoadingUpdatePatient ? (
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
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editPatientModal'
        >
          <FaPlus className='mb-1' />
        </button>
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
