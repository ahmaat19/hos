import React, { useState, useEffect } from 'react'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa'
import Pagination from '../components/Pagination'
import {
  getLabRequests,
  updateLabRequest,
  deleteLabRequest,
  addLabRequest,
  getPatients,
} from '../api/labRequests'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import moment from 'moment'
import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'

const LabRequestScreen = () => {
  const [page, setPage] = useState(1)
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

  const { data, isLoading, isError, error } = useQuery(
    'labRequests',
    () => getLabRequests(page),
    {
      retry: 0,
    }
  )

  const { data: patientData } = useQuery(
    'lab-request-patients',
    () => getPatients(),
    {
      retry: 0,
    }
  )

  const {
    isLoading: isLoadingUpdateLabRequest,
    isError: isErrorUpdateLabRequest,
    error: errorUpdateLabRequest,
    isSuccess: isSuccessUpdateLabRequest,
    mutateAsync: updateLabRequestMutateAsync,
  } = useMutation(['updateLabRequest'], updateLabRequest, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['labRequests'])
    },
  })

  const {
    isLoading: isLoadingDeleteLabRequest,
    isError: isErrorDeleteLabRequest,
    error: errorDeleteLabRequest,
    isSuccess: isSuccessDeleteLabRequest,
    mutateAsync: deleteLabRequestMutateAsync,
  } = useMutation(['deleteLabRequest'], deleteLabRequest, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['labRequests']),
  })

  const {
    isLoading: isLoadingAddLabRequest,
    isError: isErrorAddLabRequest,
    error: errorAddLabRequest,
    isSuccess: isSuccessAddLabRequest,
    mutateAsync: addLabRequestMutateAsync,
  } = useMutation(['addLabRequest'], addLabRequest, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['labRequests'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteLabRequestMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateLabRequestMutateAsync({
          _id: id,
          patient: data.patient && data.patient,
          hematology: data.hematology ? data.hematology : [],
          serology: data.serology ? data.serology : [],
          bioChemistry: data.bioChemistry ? data.bioChemistry : [],
        })
      : addLabRequestMutateAsync({
          patient: data.patient && data.patient,
          hematology: data.hematology ? data.hematology : [],
          serology: data.serology ? data.serology : [],
          bioChemistry: data.bioChemistry ? data.bioChemistry : [],
        })
  }

  const editHandler = (labRequest) => {
    setId(labRequest._id)
    setEdit(true)
    setValue('patient', labRequest.patient._id)
    setValue('hematology', labRequest.hematology)
    setValue('serology', labRequest.serology)
    setValue('bioChemistry', labRequest.bioChemistry)
  }

  useEffect(() => {
    const refetch = async () => {
      await queryClient.prefetchQuery('labRequests')
    }
    refetch()
  }, [page, queryClient])

  const hematologyTests = ['CBC', 'ESR', 'S Malaria', 'Blood Grouping', 'HB']
  const serologyTests = [
    'H Pylori',
    'R Test',
    'PCR',
    'W Test',
    'TPHA',
    'HCV',
    'HBSag',
    'Brucella',
    'Toxoplasma',
    'SIDA',
    'ASO',
    'Pregnancy Test',
    'Stool Exam',
    'Urinalysis',
  ]
  const bioChemistryTests = [
    'Urea',
    'Creatining',
    'AST',
    'ALT',
    'Total Bilirubin',
    'Indiret B',
    'Total Protein',
    'Albumin',
    'A Phosphatese',
    'TG',
    'Cholestrole',
    'HDL',
    'LDL',
    'Calcium',
    'Potassium',
    'Uric Acid',
    'Amylase',
    'VDRL',
    'FPG',
  ]
  return (
    <div className='container'>
      <Pagination data={data} setPage={setPage} />
      {isSuccessUpdateLabRequest && (
        <Message variant='success'>
          LabRequest has been updated successfully.
        </Message>
      )}
      {isErrorUpdateLabRequest && (
        <Message variant='danger'>{errorUpdateLabRequest}</Message>
      )}
      {isSuccessAddLabRequest && (
        <Message variant='success'>
          LabRequest has been Addd successfully.
        </Message>
      )}
      {isErrorAddLabRequest && (
        <Message variant='danger'>{errorAddLabRequest}</Message>
      )}
      <div
        className='modal fade'
        id='editLabRequestModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editLabRequestModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modal-lg'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editLabRequestModalLabel'>
                {edit ? 'Edit Laboratory Request' : 'Add Laboratory Request'}
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
                  <div className='row'>
                    <div className='col-12'>
                      <div className='mb-3'>
                        <label htmlFor='patient'>Patient Name</label>
                        <input
                          {...register('patient', {
                            required: 'Patient name is required',
                          })}
                          type='text'
                          className='form-control'
                          autoFocus
                          list='patientOptions'
                          id='patient'
                          placeholder='Type to search...'
                        />
                        <datalist id='patientOptions'>
                          {patientData &&
                            patientData.map((patient) => (
                              <option key={patient._id} value={patient._id}>
                                {patient.patientId} - {patient.patientName}
                              </option>
                            ))}
                          <option value=''></option>
                        </datalist>
                        {errors.patient && (
                          <span className='text-danger'>
                            {errors.patient.message}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className='fw-bold font-monospace'>HEMATOLOGY</span>
                    {hematologyTests.map((hem, index) => (
                      <div key={index} className='col-md-3 col-6'>
                        <div className='form-check'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            value={hem}
                            id={hem}
                            {...register('hematology')}
                          />
                          <label
                            className='form-check-label mt-1'
                            htmlFor={hem}
                          >
                            {hem}
                          </label>
                        </div>
                      </div>
                    ))}
                    <hr className='mt-2' />

                    <span className='fw-bold font-monospace'>SEROLOGY</span>
                    {serologyTests.map((serology, index) => (
                      <div key={index} className='col-md-3 col-6'>
                        <div className='form-check'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            value={serology}
                            id={serology}
                            {...register('serology')}
                          />
                          <label
                            className='form-check-label mt-1'
                            htmlFor={serology}
                          >
                            {serology}
                          </label>
                        </div>
                      </div>
                    ))}
                    <hr className='mt-2' />

                    <span className='fw-bold font-monospace'>BIOCHEMISTRY</span>
                    {bioChemistryTests.map((bioChemistry, index) => (
                      <div key={index} className='col-md-3 col-6'>
                        <div className='form-check'>
                          <input
                            className='form-check-input'
                            type='checkbox'
                            value={bioChemistry}
                            id={bioChemistry}
                            {...register('bioChemistry')}
                          />
                          <label
                            className='form-check-label mt-1'
                            htmlFor={bioChemistry}
                          >
                            {bioChemistry}
                          </label>
                        </div>
                      </div>
                    ))}
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
                      disabled={
                        isLoadingAddLabRequest || isLoadingUpdateLabRequest
                      }
                    >
                      {isLoadingAddLabRequest || isLoadingUpdateLabRequest ? (
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
        <h3 className=''>Laboratory Request</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editLabRequestModal'
        >
          <FaPlus className='mb-1' />
        </button>
      </div>

      {isSuccessDeleteLabRequest && (
        <Message variant='success'>
          LabRequest has been deleted successfully.
        </Message>
      )}
      {isErrorDeleteLabRequest && (
        <Message variant='danger'>{errorDeleteLabRequest}</Message>
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
                  <th>DATE & TIME</th>
                  <th>PATIENT ID</th>
                  <th>NAME</th>
                  <th>AGE</th>
                  <th>DOCTOR</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.data.map((labRequest) => (
                    <tr key={labRequest._id}>
                      <td>{moment(labRequest.createdAt).format('llll')}</td>
                      <td>{labRequest.patient.patientId}</td>
                      <td>{labRequest.patient.patientName}</td>
                      <td>{labRequest.patient.age}</td>
                      <td>{labRequest.createdBy.name}</td>
                      <td className='btn-group'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(labRequest)}
                          data-bs-toggle='modal'
                          data-bs-target='#editLabRequestModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm ms-1'
                          onClick={() => deleteHandler(labRequest._id)}
                          disabled={isLoadingDeleteLabRequest}
                        >
                          {isLoadingDeleteLabRequest ? (
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

export default LabRequestScreen
