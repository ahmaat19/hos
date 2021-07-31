import React, { useState, useEffect, useRef } from 'react'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import Pagination from '../components/Pagination'
import {
  getPatients,
  updatePatient,
  deletePatient,
  addPatient,
} from '../api/patients'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'

const PatientScreen = () => {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      admin: false,
      patient: false,
    },
  })

  const queryClient = useQueryClient()

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
    isLoading: isLoadingDeletePatient,
    isError: isErrorDeletePatient,
    error: errorDeletePatient,
    isSuccess: isSuccessDeletePatient,
    mutateAsync: deletePatientMutateAsync,
  } = useMutation(['deletePatient'], deletePatient, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['patients']),
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

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deletePatientMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updatePatientMutateAsync({
          _id: id,
          gender: data.gender,
          mobile: data.mobile,
          patientName: data.patientName,
          age: data.age,
        })
      : addPatientMutateAsync(data)
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
  const searchHandler = () => {
    // inputEl.current.focus()
    console.log(inputEl.current.value)
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-8 col-12'>
          {/* <form onSubmit={(e) => searchHandler(e)} className='form-inline'> */}
          <div className='input-group mb-3'>
            <input
              type='text'
              className='form-control'
              placeholder='Search patient'
              aria-describedby='search'
              ref={inputEl}
              // onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className='input-group-text btn btn-primary border-0'
              id='search'
              onClick={searchHandler}
            >
              Search
            </button>
          </div>
          {/* </form> */}
        </div>
        <div className='col-md-4 col-12'>
          <Pagination data={data} setPage={setPage} />
        </div>
      </div>
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
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editPatientModalLabel'>
                {edit ? 'Edit Patient' : 'Add Patient'}
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
                <form onSubmit={handleSubmit(submitHandler)}>
                  <div className='mb-3'>
                    <label htmlFor='patientName'>Patient Name</label>
                    <input
                      {...register('patientName', {
                        required: 'Patient name is required',
                      })}
                      type='text'
                      placeholder='Enter patient name'
                      className='form-control'
                      autoFocus
                    />
                    {errors.patientName && (
                      <span className='text-danger'>
                        {errors.patientName.message}
                      </span>
                    )}
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='gender'>Gender</label>
                    <select
                      {...register('gender', {
                        required: 'Gender is required',
                      })}
                      type='text'
                      placeholder='Enter gender'
                      className='form-control'
                    >
                      <option value=''>Gender</option>
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                    </select>
                    {errors.gender && (
                      <span className='text-danger'>
                        {errors.gender.message}
                      </span>
                    )}
                  </div>

                  <div className='mb-3'>
                    <label htmlFor='age'>Patient Age</label>
                    <input
                      {...register('age', {
                        required: 'Patient age is required',
                      })}
                      type='Number'
                      min='0'
                      step='0.1'
                      placeholder='Enter patient age'
                      className='form-control'
                      autoFocus
                    />
                    {errors.age && (
                      <span className='text-danger'>{errors.age.message}</span>
                    )}
                  </div>
                  <div className='mb-3'>
                    <label htmlFor='mobile'>Mobile Number</label>
                    <input
                      {...register('mobile', {
                        required: 'Mobile number is required',
                      })}
                      type='number'
                      min='0'
                      placeholder='Enter mobile number'
                      className='form-control'
                      autoFocus
                    />
                    {errors.mobile && (
                      <span className='text-danger'>
                        {errors.mobile.message}
                      </span>
                    )}
                  </div>

                  <div className='modal-footer'>
                    <button
                      type='button'
                      className='btn btn-secondary '
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

      {isSuccessDeletePatient && (
        <Message variant='success'>
          Patient has been deleted successfully.
        </Message>
      )}
      {isErrorDeletePatient && (
        <Message variant='danger'>{errorDeletePatient}</Message>
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
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.data.map((patient) => (
                    <tr key={patient._id}>
                      <td>{patient.patientId}</td>
                      <td>{patient.patientName}</td>
                      <td>{patient.gender}</td>
                      <td>{patient.age}</td>
                      <td>{patient.mobile}</td>

                      <td className='btn-group'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(patient)}
                          data-bs-toggle='modal'
                          data-bs-target='#editPatientModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm ms-1'
                          onClick={() => deleteHandler(patient._id)}
                          disabled={isLoadingDeletePatient}
                        >
                          {isLoadingDeletePatient ? (
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

export default PatientScreen
