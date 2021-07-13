import { useState, useEffect } from 'react'
import { FaArrowAltCircleLeft } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Message from '../components/Message'
import Loader from 'react-loader-spinner'
import {
  updateHistory,
  addHistory,
  getPatientHistoryDetail,
} from '../api/histories'
import { useQuery, useMutation, useQueryClient } from 'react-query'

const HistoryFormScreen = () => {
  const { id } = useParams()
  const [isGyn, setIsGyn] = useState(false)

  const queryClient = useQueryClient()

  const { data, isLoading, isError, error } = useQuery(
    'history',
    () => id && getPatientHistoryDetail(id && id),
    {
      retry: 0,
    }
  )

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

  useEffect(() => {
    if (id && data) {
      setValue('abortion', data.abortion)
      setValue('ageOfLastBaby', data.ageOfLastBaby)
      setValue('ageType', data.ageType)
      setValue('alive', data.alive)
      setValue('bloodPressure', data.bloodPressure)
      setValue('cSection', data.cSection)
      setValue('chiefComplain', data.chiefComplain)
      setValue('couple', data.couple)
      setValue('craniotomy', data.craniotomy)
      setValue('definitive', data.definitive)
      setValue('embryotomy', data.embryotomy)
      setValue('forcep', data.forcep)
      setValue('ga', data.ga)
      setValue('generalAppearance', data.generalAppearance)
      setValue('gravida', data.gravida)
      setValue('height', data.height)
      setValue('howManyYears', data.howManyYears)
      setValue('hpi', data.hpi)
      setValue('induction', data.induction)
      setValue('lactated', data.lactated)
      setValue('lmp', data.lmp)
      setValue('noOfChildren', data.noOfChildren)
      setValue('pmh', data.pmh)
      setValue('para', data.para)
      setValue('pregnancy', data.pregnancy)
      setValue('pulse', data.pulse)
      setValue('reproductiveType', data.reproductiveType)
      setValue('respiratory', data.respiratory)
      setValue('spO2', data.spO2)
      setValue('stillBirth', data.stillBirth)
      setValue('suspectDiagnosis', data.suspectDiagnosis)
      setValue('svd', data.svd)
      setValue('systemicExamination', data.systemicExamination)
      setValue('temperature', data.temperature)
      setValue('updatedAt', data.updatedAt)
      setValue('vacuum', data.vacuum)
      setValue('weight', data.weight)
    }
  }, [id, data])

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

  const submitHandler = (obj) => {
    id
      ? updateHistoryMutateAsync({
          _id: id,
          reqObj: { patient: data.patient, obj },
        })
      : addHistoryMutateAsync(obj)
  }
  return (
    <div className='container'>
      {isSuccessUpdateHistory && (
        <Message variant='success'>
          History taking has been updated successfully.
        </Message>
      )}
      {isErrorUpdateHistory && (
        <Message variant='danger'>{errorUpdateHistory}</Message>
      )}
      {isSuccessAddHistory && (
        <Message variant='success'>
          History taking has been done successfully.
        </Message>
      )}
      {isErrorAddHistory && (
        <Message variant='danger'>{errorAddHistory}</Message>
      )}
      {isLoading && (
        <div className='text-center'>
          <Loader
            type='ThreeDots'
            color='#00BFFF'
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>
      )}
      {isError && <Message variant='danger'>{error}</Message>}
      {id && id}

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

      <form onSubmit={handleSubmit(submitHandler)}>
        <div className='row gx-2'>
          <div className='col-md-6 col-12'>
            <div className='mb-3'>
              <label htmlFor='chiefComplain'>Chief complain</label>
              <input
                {...register('chiefComplain', {
                  required: 'Chief complain is required',
                })}
                type='text'
                placeholder='Enter chief complain'
                className='form-control'
                autoFocus
              />
              {errors.chiefComplain && (
                <span className='text-danger'>
                  {errors.chiefComplain.message}
                </span>
              )}
            </div>
          </div>

          <div className='col-md-6 col-12'>
            <div className='mb-3'>
              <label htmlFor='hpi'>History of present illness</label>
              <input
                {...register('hpi')}
                type='text'
                placeholder='Enter patient'
                className='form-control'
                autoFocus
              />
              {errors.hpi && (
                <span className='text-danger'>{errors.hpi.message}</span>
              )}
            </div>
          </div>

          <div className='col-md-4 col-12'>
            <div className='mb-3'>
              <label htmlFor='pmh'>Past medical history</label>
              <input
                {...register('pmh')}
                type='text'
                placeholder='Enter past medical history'
                className='form-control'
                autoFocus
              />
              {errors.pmh && (
                <span className='text-danger'>{errors.pmh.message}</span>
              )}
            </div>
          </div>

          <div className='col-md-4 col-12'>
            <div className='mb-3'>
              <label htmlFor='generalAppearance'>General appearance</label>
              <input
                {...register('generalAppearance')}
                type='text'
                placeholder='Enter general appearance'
                className='form-control'
                autoFocus
              />
              {errors.generalAppearance && (
                <span className='text-danger'>
                  {errors.generalAppearance.message}
                </span>
              )}
            </div>
          </div>
          <div className='col-md-4 col-12'>
            <div className='form-check form-switch mt-4 pt-2'>
              <input
                className='form-check-input'
                type='checkbox'
                id='flexSwitchCheckChecked'
                checked={isGyn}
                onChange={(e) => setIsGyn(e.target.checked)}
              />
              <label
                className='form-check-label'
                htmlFor='flexSwitchCheckChecked'
              >
                Check if gynecological history
              </label>
            </div>
          </div>
          {isGyn && (
            <>
              <h5>Gyn and Obs History</h5>
              <hr />
              <div className='col-md-6 col-12 '>
                <div className='mb-3'>
                  <label htmlFor='ageType'>Age type</label>
                  <select
                    {...register('ageType')}
                    type='text'
                    placeholder='Age type'
                    className='form-control'
                    autoFocus
                  >
                    <option value=''>-----------</option>
                    <option value='Child'>Child</option>
                    <option value='Reproductive'>Reproductive</option>
                    <option value='Men Pause'>Men Pause</option>
                  </select>
                  {errors.ageType && (
                    <span className='text-danger'>
                      {errors.ageType.message}
                    </span>
                  )}
                </div>
              </div>
              <div className='col-md-6 col-12 '>
                <div className='mb-3'>
                  <label htmlFor='reproductiveType'>Reproductive Type</label>
                  <select
                    {...register('reproductiveType')}
                    type='text'
                    placeholder='Reproductive Type'
                    className='form-control'
                    autoFocus
                  >
                    <option value=''>-----------</option>
                    <option value='Nulli Parity'>Nulli Parity</option>
                    <option value='Multi Parity'>Multi Parity</option>
                  </select>
                  {errors.reproductiveType && (
                    <span className='text-danger'>
                      {errors.reproductiveType.message}
                    </span>
                  )}
                </div>
              </div>

              <h5>Past obstetric history</h5>
              <hr />
              <div className='col-md-2 col-12'>
                <div className='mb-3'>
                  <label htmlFor='noOfChildren'>False of children</label>
                  <input
                    {...register('noOfChildren')}
                    type='text'
                    placeholder='Enter False of children'
                    className='form-control'
                    autoFocus
                  />
                  {errors.noOfChildren && (
                    <span className='text-danger'>
                      {errors.noOfChildren.message}
                    </span>
                  )}
                </div>
              </div>

              <div className='col-md-2 col-12'>
                <div className='mb-3'>
                  <label htmlFor='gravida'>Gravida</label>
                  <input
                    {...register('gravida')}
                    type='text'
                    placeholder='Enter Gravida'
                    className='form-control'
                    autoFocus
                  />
                  {errors.gravida && (
                    <span className='text-danger'>
                      {errors.gravida.message}
                    </span>
                  )}
                </div>
              </div>
              <div className='col-md-2 col-12'>
                <div className='mb-3'>
                  <label htmlFor='para'>Para</label>
                  <input
                    {...register('para')}
                    type='text'
                    placeholder='Enter Para'
                    className='form-control'
                    autoFocus
                  />
                  {errors.para && (
                    <span className='text-danger'>{errors.para.message}</span>
                  )}
                </div>
              </div>
              <div className='col-md-2 col-12'>
                <div className='mb-3'>
                  <label htmlFor='abortion'>Abortion</label>
                  <input
                    {...register('abortion')}
                    type='text'
                    placeholder='Enter Abortion'
                    className='form-control'
                    autoFocus
                  />
                  {errors.abortion && (
                    <span className='text-danger'>
                      {errors.abortion.message}
                    </span>
                  )}
                </div>
              </div>
              <div className='col-md-2 col-12'>
                <div className='mb-3'>
                  <label htmlFor='stillBirth'>Still birth</label>
                  <input
                    {...register('stillBirth')}
                    type='text'
                    placeholder='Still birth'
                    className='form-control'
                    autoFocus
                  />
                  {errors.stillBirth && (
                    <span className='text-danger'>
                      {errors.stillBirth.message}
                    </span>
                  )}
                </div>
              </div>

              <div className='col-md-2 col-12'>
                <div className='mb-3'>
                  <label htmlFor='alive'>Alive</label>
                  <input
                    {...register('alive')}
                    type='text'
                    placeholder='Alive'
                    className='form-control'
                    autoFocus
                  />
                  {errors.alive && (
                    <span className='text-danger'>{errors.alive.message}</span>
                  )}
                </div>
              </div>

              <h5>Mode of delivery</h5>
              <hr />
              <div className='col-md-2 col-12'>
                <div className='mb-3'>
                  <label htmlFor='svd'>SVD</label>
                  <input
                    {...register('svd')}
                    type='text'
                    placeholder='Enter SVD'
                    className='form-control'
                    autoFocus
                  />
                  {errors.svd && (
                    <span className='text-danger'>{errors.svd.message}</span>
                  )}
                </div>
              </div>

              <div className='col-md-2 col-12'>
                <div className='mb-3'>
                  <label htmlFor='induction'>Induction</label>
                  <input
                    {...register('induction')}
                    type='text'
                    placeholder='Enter Induction'
                    className='form-control'
                    autoFocus
                  />
                  {errors.induction && (
                    <span className='text-danger'>
                      {errors.induction.message}
                    </span>
                  )}
                </div>
              </div>
              <div className='col-md-1 col-12'>
                <div className='mb-3'>
                  <label htmlFor='forcep'>Forcep</label>
                  <input
                    {...register('forcep')}
                    type='text'
                    placeholder='Enter Forcep'
                    className='form-control'
                    autoFocus
                  />
                  {errors.forcep && (
                    <span className='text-danger'>{errors.forcep.message}</span>
                  )}
                </div>
              </div>
              <div className='col-md-1 col-12'>
                <div className='mb-3'>
                  <label htmlFor='vacuum'>Vacuum</label>
                  <input
                    {...register('vacuum')}
                    type='text'
                    placeholder='Enter Vacuum'
                    className='form-control'
                    autoFocus
                  />
                  {errors.vacuum && (
                    <span className='text-danger'>{errors.vacuum.message}</span>
                  )}
                </div>
              </div>
              <div className='col-md-1 col-12'>
                <div className='mb-3'>
                  <label htmlFor='cSection'>C/ Section</label>
                  <input
                    {...register('cSection')}
                    type='text'
                    placeholder='C/ Section'
                    className='form-control'
                    autoFocus
                  />
                  {errors.cSection && (
                    <span className='text-danger'>
                      {errors.cSection.message}
                    </span>
                  )}
                </div>
              </div>

              <div className='col-md-2 col-12'>
                <div className='mb-3'>
                  <label htmlFor='craniotomy'>Craniotomy</label>
                  <input
                    {...register('craniotomy')}
                    type='text'
                    placeholder='Craniotomy'
                    className='form-control'
                    autoFocus
                  />
                  {errors.craniotomy && (
                    <span className='text-danger'>
                      {errors.craniotomy.message}
                    </span>
                  )}
                </div>
              </div>
              <div className='col-md-1 col-12'>
                <div className='mb-3'>
                  <label htmlFor='embryotomy'>Embryotomy</label>
                  <input
                    {...register('embryotomy')}
                    type='text'
                    placeholder='Embryotomy'
                    className='form-control'
                    autoFocus
                  />
                  {errors.embryotomy && (
                    <span className='text-danger'>
                      {errors.embryotomy.message}
                    </span>
                  )}
                </div>
              </div>
              <div className='col-md-2 col-12'>
                <div className='mb-3'>
                  <label htmlFor='ageOfLastBaby'>Age of last baby</label>
                  <input
                    {...register('ageOfLastBaby')}
                    type='text'
                    placeholder='Age of last baby'
                    className='form-control'
                    autoFocus
                  />
                  {errors.ageOfLastBaby && (
                    <span className='text-danger'>
                      {errors.ageOfLastBaby.message}
                    </span>
                  )}
                </div>
              </div>

              <div className='col-md-2 col-12'>
                <div className='mb-3'>
                  <label htmlFor='lactated'>Lactated</label>
                  <select
                    {...register('lactated')}
                    type='text'
                    placeholder='Lactated'
                    className='form-control'
                    autoFocus
                  >
                    <option value=''>-----------</option>
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                  </select>
                  {errors.lactated && (
                    <span className='text-danger'>
                      {errors.lactated.message}
                    </span>
                  )}
                </div>
              </div>
              <div className='col-md-2 col-12'>
                <div className='mb-3'>
                  <label htmlFor='couple'>Couple</label>
                  <select
                    {...register('couple')}
                    type='text'
                    placeholder='Couple'
                    className='form-control'
                    autoFocus
                  >
                    <option value=''>-----------</option>
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                  </select>
                  {errors.couple && (
                    <span className='text-danger'>{errors.couple.message}</span>
                  )}
                </div>
              </div>
              <div className='col-md-2 col-12'>
                <div className='mb-3'>
                  <label htmlFor='howManyYears'>How many years?</label>
                  <input
                    {...register('howManyYears')}
                    type='text'
                    placeholder='How many years?'
                    className='form-control'
                    autoFocus
                  />
                  {errors.howManyYears && (
                    <span className='text-danger'>
                      {errors.howManyYears.message}
                    </span>
                  )}
                </div>
              </div>
              <div className='col-md-2 col-12'>
                <div className='mb-3'>
                  <label htmlFor='pregnancy'>Pregnancy</label>
                  <select
                    {...register('pregnancy')}
                    type='text'
                    placeholder='Pregnancy'
                    className='form-control'
                    autoFocus
                  >
                    <option value=''>-----------</option>
                    <option value={true}>True</option>
                    <option value={false}>False</option>
                  </select>
                  {errors.pregnancy && (
                    <span className='text-danger'>
                      {errors.pregnancy.message}
                    </span>
                  )}
                </div>
              </div>

              <div className='col-md-2 col-12'>
                <div className='mb-3'>
                  <label htmlFor='lmp'>LMP</label>
                  <input
                    {...register('lmp')}
                    type='text'
                    placeholder='LMP'
                    className='form-control'
                    autoFocus
                  />
                  {errors.lmp && (
                    <span className='text-danger'>{errors.lmp.message}</span>
                  )}
                </div>
              </div>
              <div className='col-md-2 col-12'>
                <div className='mb-3'>
                  <label htmlFor='ga'>GA</label>
                  <input
                    {...register('ga')}
                    type='text'
                    placeholder='GA'
                    className='form-control'
                    autoFocus
                  />
                  {errors.ga && (
                    <span className='text-danger'>{errors.ga.message}</span>
                  )}
                </div>
              </div>
            </>
          )}

          <h5>General Examination</h5>
          <hr />
          <div className='col-md-2 col-12'>
            <div className='mb-3'>
              <label htmlFor='bloodPressure'>Blood pressure</label>
              <input
                {...register('bloodPressure')}
                type='text'
                placeholder='Enter Blood pressure'
                className='form-control'
                autoFocus
              />
              {errors.bloodPressure && (
                <span className='text-danger'>
                  {errors.bloodPressure.message}
                </span>
              )}
            </div>
          </div>

          <div className='col-md-2 col-12'>
            <div className='mb-3'>
              <label htmlFor='pulse'>Pulse</label>
              <input
                {...register('pulse')}
                type='text'
                placeholder='Enter Pulse'
                className='form-control'
                autoFocus
              />
              {errors.pulse && (
                <span className='text-danger'>{errors.pulse.message}</span>
              )}
            </div>
          </div>
          <div className='col-md-2 col-12'>
            <div className='mb-3'>
              <label htmlFor='temperature'>Temperature</label>
              <input
                {...register('temperature')}
                type='text'
                placeholder='Enter Temperature'
                className='form-control'
                autoFocus
              />
              {errors.temperature && (
                <span className='text-danger'>
                  {errors.temperature.message}
                </span>
              )}
            </div>
          </div>
          <div className='col-md-2 col-12'>
            <div className='mb-3'>
              <label htmlFor='respiratory'>Respiratory</label>
              <input
                {...register('respiratory')}
                type='text'
                placeholder='Enter Respiratory'
                className='form-control'
                autoFocus
              />
              {errors.respiratory && (
                <span className='text-danger'>
                  {errors.respiratory.message}
                </span>
              )}
            </div>
          </div>
          <div className='col-md-1 col-12'>
            <div className='mb-3'>
              <label htmlFor='weight'>Weight</label>
              <input
                {...register('weight')}
                type='text'
                placeholder='Weight'
                className='form-control'
                autoFocus
              />
              {errors.weight && (
                <span className='text-danger'>{errors.weight.message}</span>
              )}
            </div>
          </div>

          <div className='col-md-1 col-12'>
            <div className='mb-3'>
              <label htmlFor='height'>Height</label>
              <input
                {...register('height')}
                type='text'
                placeholder='Height'
                className='form-control'
                autoFocus
              />
              {errors.height && (
                <span className='text-danger'>{errors.height.message}</span>
              )}
            </div>
          </div>

          <div className='col-md-2 col-12'>
            <div className='mb-3'>
              <label htmlFor='spO2'>PsO2</label>
              <input
                {...register('spO2')}
                type='text'
                placeholder='Enter PsO2'
                className='form-control'
                autoFocus
              />
              {errors.spO2 && (
                <span className='text-danger'>{errors.spO2.message}</span>
              )}
            </div>
          </div>

          <div className='col-md-4 col-12'>
            <div className='mb-3'>
              <label htmlFor='systemicExamination'>Systemic examination</label>
              <input
                {...register('systemicExamination')}
                type='text'
                placeholder='Enter Systemic examination'
                className='form-control'
                autoFocus
              />
              {errors.systemicExamination && (
                <span className='text-danger'>
                  {errors.systemicExamination.message}
                </span>
              )}
            </div>
          </div>

          <div className='col-md-4 col-12'>
            <div className='mb-3'>
              <label htmlFor='suspectDiagnosis'>Provisional suspect</label>
              <input
                {...register('suspectDiagnosis')}
                type='text'
                placeholder='Enter Provisional suspect'
                className='form-control'
                autoFocus
              />
              {errors.suspectDiagnosis && (
                <span className='text-danger'>
                  {errors.suspectDiagnosis.message}
                </span>
              )}
            </div>
          </div>

          <div className='col-md-3 col-12'>
            <div className='mb-3'>
              <label htmlFor='definitive'>Definitive</label>
              <input
                {...register('definitive')}
                type='text'
                placeholder='Enter Definitive'
                className='form-control'
                autoFocus
              />
              {errors.definitive && (
                <span className='text-danger'>{errors.definitive.message}</span>
              )}
            </div>
          </div>
          <div className='col-md-1 col-12 my-auto'>
            <button
              type='submit'
              className='btn btn-primary mt-2 btn-lg'
              disabled={isLoadingAddHistory || isLoadingUpdateHistory}
            >
              {isLoadingAddHistory || isLoadingUpdateHistory ? (
                <span className='spinner-border spinner-border-sm' />
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default HistoryFormScreen
