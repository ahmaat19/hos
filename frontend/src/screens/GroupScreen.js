import React, { useState } from 'react'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import moment from 'moment'
import {
  FaCheckCircle,
  FaEdit,
  FaPlus,
  FaTimesCircle,
  FaTrash,
} from 'react-icons/fa'

import { getGroups, updateGroup, deleteGroup, addGroup } from '../api/groups'
import { useQuery, useMutation, useQueryClient } from 'react-query'

import { confirmAlert } from 'react-confirm-alert'
import { Confirm } from '../components/Confirm'
import { useForm } from 'react-hook-form'
import { getRoutes } from '../api/routes'

const GroupScreen = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      isActive: true,
    },
  })

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    'groups',
    () => getGroups(),
    {
      retry: 0,
    }
  )

  const { data: routeData } = useQuery('routes', () => getRoutes(), {
    retry: 0,
  })

  const {
    isLoading: isLoadingUpdateGroup,
    isError: isErrorUpdateGroup,
    error: errorUpdateGroup,
    isSuccess: isSuccessUpdateGroup,
    mutateAsync: updateGroupMutateAsync,
  } = useMutation(['updateGroup'], updateGroup, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['groups'])
    },
  })

  const {
    isLoading: isLoadingDeleteGroup,
    isError: isErrorDeleteGroup,
    error: errorDeleteGroup,
    isSuccess: isSuccessDeleteGroup,
    mutateAsync: deleteGroupMutateAsync,
  } = useMutation(['deleteGroup'], deleteGroup, {
    retry: 0,
    onSuccess: () => queryClient.invalidateQueries(['groups']),
  })

  const {
    isLoading: isLoadingAddGroup,
    isError: isErrorAddGroup,
    error: errorAddGroup,
    isSuccess: isSuccessAddGroup,
    mutateAsync: addGroupMutateAsync,
  } = useMutation(['addGroup'], addGroup, {
    retry: 0,
    onSuccess: () => {
      reset()
      queryClient.invalidateQueries(['groups'])
    },
  })

  const [id, setId] = useState(null)
  const [edit, setEdit] = useState(false)

  const formCleanHandler = () => {
    setEdit(false)
    reset()
  }

  const deleteHandler = (id) => {
    confirmAlert(Confirm(() => deleteGroupMutateAsync(id)))
  }

  const submitHandler = (data) => {
    edit
      ? updateGroupMutateAsync({
          _id: id,
          name: data.name,
          route: data.route,
          isActive: data.isActive,
        })
      : addGroupMutateAsync(data)
  }

  const editHandler = (group) => {
    setId(group._id)
    setEdit(true)
    setValue('name', group.name)
    setValue(
      'route',
      group.route.map((id) => id._id)
    )
    setValue('isActive', group.isActive)
  }

  return (
    <div className='container'>
      {isSuccessUpdateGroup && (
        <Message variant='success'>
          Group has been updated successfully.
        </Message>
      )}
      {isErrorUpdateGroup && (
        <Message variant='danger'>{errorUpdateGroup}</Message>
      )}
      {isSuccessAddGroup && (
        <Message variant='success'>
          Group has been Created successfully.
        </Message>
      )}
      {isErrorAddGroup && <Message variant='danger'>{errorAddGroup}</Message>}
      {isSuccessDeleteGroup && (
        <Message variant='success'>
          Group has been deleted successfully.
        </Message>
      )}
      {isErrorDeleteGroup && (
        <Message variant='danger'>{errorDeleteGroup}</Message>
      )}
      <div
        className='modal fade'
        id='editGroupModal'
        data-bs-backdrop='static'
        data-bs-keyboard='false'
        tabIndex='-1'
        aria-labelledby='editGroupModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog'>
          <div className='modal-content modal-background'>
            <div className='modal-header'>
              <h3 className='modal-title ' id='editGroupModalLabel'>
                {edit ? 'Edit Group' : 'Add Group'}
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
                    <label htmlFor='name'>Name</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type='text'
                      placeholder='Enter name'
                      className='form-control'
                      autoFocus
                    />
                    {errors.name && (
                      <span className='text-danger'>{errors.name.message}</span>
                    )}
                  </div>

                  <div className='row g-1 mb-3'>
                    {routeData &&
                      routeData.map((route) => (
                        <div key={route._id} className='col-md-4 col-6'>
                          <div className='form-check'>
                            <input
                              {...register('route')}
                              className='form-check-input'
                              type='checkbox'
                              value={route._id}
                              id={`flexCheck${route._id}`}
                            />
                            <label
                              className='form-check-label'
                              htmlFor={`flexCheck${route._id}`}
                            >
                              {route.name}
                            </label>
                          </div>
                        </div>
                      ))}
                  </div>

                  <div className='row'>
                    <div className='col'>
                      <div className='form-check'>
                        <input
                          className='form-check-input'
                          type='checkbox'
                          id='isActive'
                          {...register('isActive')}
                          checked={watch().isActive}
                        />
                        <label className='form-check-label' htmlFor='isActive'>
                          is Active?
                        </label>
                      </div>
                    </div>
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
                      disabled={isLoadingAddGroup || isLoadingUpdateGroup}
                    >
                      {isLoadingAddGroup || isLoadingUpdateGroup ? (
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
        <h3 className=''>Groups</h3>
        <button
          className='btn btn-primary '
          data-bs-toggle='modal'
          data-bs-target='#editGroupModal'
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
              <caption>{data && data.length} records were found</caption>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>GROUP NAME</th>
                  <th>ACTIVE</th>
                  <th>DATE & TIME</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.map((group) => (
                    <tr key={group._id}>
                      <td>{group._id}</td>
                      <td>
                        {group.name.charAt(0).toUpperCase() +
                          group.name.slice(1)}
                      </td>
                      <td>
                        {group.isActive ? (
                          <FaCheckCircle className='text-success mb-1' />
                        ) : (
                          <FaTimesCircle className='text-danger mb-1' />
                        )}
                      </td>
                      <td>{moment(group.createdAt).format('llll')}</td>

                      <td className='btn-group'>
                        <button
                          className='btn btn-primary btn-sm'
                          onClick={() => editHandler(group)}
                          data-bs-toggle='modal'
                          data-bs-target='#editGroupModal'
                        >
                          <FaEdit className='mb-1' /> Edit
                        </button>

                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteHandler(group._id)}
                          disabled={isLoadingDeleteGroup}
                        >
                          {isLoadingDeleteGroup ? (
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

export default GroupScreen
