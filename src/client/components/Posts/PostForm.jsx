import styles from './PostForm.module.scss'
import { Textarea, Button, Datepicker, Label, TextInput, Checkbox, Card, Select, Spinner } from 'flowbite-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { CATEGORIES } from '../../utils/staticData'
import DragNDrop from '../RHF/DragNDrop'
import LocationSelector from '../RHF/Location/LocationSelector'

const PostForm = ({ isEdit = false, post, onSubmit, onDismiss, isPending }) => {
  console.log(post)

  // Define a schema for the location object
  const locationSchema = z.object({
    city: z.string().trim().min(2).max(30).optional(),
    country: z.string().trim().min(2).max(30).optional(),
    lat: z.string().optional(),
    long: z.string().optional()
  })

  const postFormSchema = z
    .object({
      postId: z.string().optional(),
      category: z.string().refine(category => category !== '', {
        message: 'Please choose a category'
      }),
      title: z.string().min(3).max(100),
      startDate: z.date(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      endDate: z.date().optional(),
      isAllDay: z.boolean().optional(),
      isEndDate: z.boolean().optional(),
      isRemoteHelp: z.boolean().optional(),
      location: locationSchema.optional(), // Make location optional
      img: z.any().optional(),
      description: z.string().min(5).max(700)
    })
    .refine(
      ({ location, isRemoteHelp }) => {
        if (!isRemoteHelp) {
          return location && location.lat && location.long
        }
        return true
      },
      {
        path: ['location.city'],
        message: 'City is required'
      }
    )
    .refine(({ isAllDay, startTime }) => isAllDay || /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(startTime), {
      path: ['startTime'],
      message: 'Invalid'
    })
    .refine(
      ({ isAllDay, endTime, isEndDate }) => isAllDay || !isEndDate || /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(endTime),
      {
        path: ['endTime'],
        message: 'Invalid'
      }
    )

  const formValues = {
    ...(isEdit &&
      post && {
        ...post,
        postId: post._id,
        location: {
          ...post.location,
          lat: post.location.geometry?.coordinates[0].toString(),
          long: post.location.geometry?.coordinates[1].toString()
        },

        isRemoteHelp: Boolean(post.isRemoteHelp),
        startDate: new Date(post.helpDate.startDate),
        endDate: new Date(post.helpDate.endDate),
        isAllDay: Boolean(post.helpDate.isAllDay),
        isEndDate: Boolean(post.helpDate.isEndDate)
      })

    // NOTE:: for testing purpoeses only.

    //   category: 'TRAVEL',
    //   startTime: '12:00',
    //   endTime: '16:00',
    //   address: 'Even Gvirol, 22',
    //   city: 'Herzliya',
    //   description:
    //     'Hello everybody, I need your help with traveling with me to Italy to hike in the mountains, and help me with my wheelchair.'
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    watch,
    control
  } = useForm({
    defaultValues: {
      // startTime: '',
      // endTime: '',
      isRemoteHelp: false,
      startDate: new Date(new Date().setHours(0, 0, 0, 0)),
      endDate: new Date(new Date().setHours(0, 0, 0, 0)),
      isAllDay: true,

      ...formValues
    },
    resolver: zodResolver(postFormSchema)
  })

  return (
    <Card>
      <h4 style={{ marginBottom: 0 }}>{isEdit ? 'Edit post' : 'Create new post'}</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2 mt-4">
          <Label className={styles.label} htmlFor="category">
            Choose an appropriate category *
          </Label>
          <Select
            {...register('category')}
            id="category"
            color={errors.category ? 'failure' : 'gray'}
            helperText={errors.category?.message}>
            <option value="">Category</option>
            {Object.entries(CATEGORIES)
              .slice(1)
              .map(item => {
                const id = item[0]
                const category = item[1]

                return (
                  <option key={id} value={id}>
                    {category.name}
                  </option>
                )
              })}
          </Select>
        </div>

        <div className={styles.helpDates}>
          <Label className={styles.label}>When do you need your help?</Label>
          <div className="flex mb-2">
            <span>
              <Datepicker
                color={errors.startDate ? 'failure' : 'gray'}
                helperText={errors.startDate?.message}
                value={watch('startDate').toDateString()}
                onSelectedDateChanged={value => {
                  setValue('startDate', value)
                  setValue('endDate', value)
                }}
                showClearButton={false}
                showTodayButton={false}
                id="startDate"
                minDate={new Date()}
                {...register('startDate')}
              />
            </span>

            {!watch('isAllDay') && (
              <span className={styles.startTime}>
                <TextInput
                  color={errors.startTime ? 'failure' : 'gray'}
                  helperText={errors.startTime?.message}
                  placeholder="10:00"
                  {...register('startTime')}
                  maxLength={5}
                />
              </span>
            )}

            {!watch('isAllDay') && watch('isEndDate') && (
              <>
                <label className={styles.label}>to</label>
                <span className={styles.endTime}>
                  <TextInput
                    placeholder="18:00"
                    {...register('endTime')}
                    maxLength={5}
                    color={errors.endTime ? 'failure' : 'gray'}
                    helperText={errors.endTime?.message}
                  />
                </span>
              </>
            )}
            {watch('isEndDate') && (
              <span>
                <Datepicker
                  value={watch('endDate').toDateString()}
                  showClearButton={false}
                  showTodayButton={false}
                  onSelectedDateChanged={value => setValue('endDate', value)}
                  id="endDate"
                  minDate={watch('startDate')}
                  {...register('endDate')}
                  color={errors.endDate ? 'failure' : 'gray'}
                  helperText={errors.endDate?.message}
                />
              </span>
            )}
          </div>

          <div className="flex">
            <div className="flex gap-2 items-center">
              <Checkbox id="allDay" {...register('isAllDay')} />
              <Label htmlFor="allDay">All day</Label>
            </div>
            <div className="flex gap-2 items-center">
              <Checkbox id="isEndDate" {...register('isEndDate')} />
              <Label htmlFor="isEndDate">End Date</Label>
            </div>
          </div>
        </div>

        <div className="mb-2">
          <div className="flex gap-2 mb-2">
            <Label className={styles.label} htmlFor="city">
              Where do you need your help?{' '}
            </Label>
            <div className={styles.remoteHelp}>
              <Checkbox id="remoteHelp" {...register('isRemoteHelp')} />
              <Label htmlFor="remoteHelp">Remote Help</Label>
            </div>
          </div>

          {!watch('isRemoteHelp') && (
            <>
              <Label value="Address" className="mb-2 block" />
              <LocationSelector
                {...{ control }}
                names={{
                  city: 'location.city',
                  country: 'location.country',
                  lat: 'location.lat',
                  long: 'location.long'
                }}
              />
            </>
          )}
        </div>

        <Label className={styles.label} value="Title *" />
        <TextInput
          {...register('title')}
          maxLength={100}
          color={errors.title ? 'failure' : 'gray'}
          helperText={errors.title?.message}
        />

        <div className="mb-4">
          <Label className={styles.label} htmlFor="description">
            {' '}
            Description *{' '}
          </Label>
          <div className="mb-2 block">
            {' '}
            <Label htmlFor="description" />{' '}
          </div>
          <Textarea
            id="description"
            placeholder="Describe what kind of help you need"
            rows={5}
            {...register('description')}
            color={errors.description ? 'failure' : 'gray'}
            helperText={errors.description?.message}
          />
        </div>

        <Label className={styles.label} value="Picture of your post (optional)" />
        <DragNDrop {...{ register, watch }} name="img" txtFileType="SVG, PNG, JPG or GIF (MAX. 800x400px)" />

        <div className={styles.submitButton}>
          <Button type="submit" disabled={isPending} className="button">
            {isPending ? <Spinner /> : <>{isEdit ? 'Save changes' : 'Create post'}</>}
          </Button>
          <Button onClick={onDismiss} disabled={isPending} color="light">
            Later
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default PostForm
