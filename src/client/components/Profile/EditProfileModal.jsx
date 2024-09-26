import { Label, TextInput, Textarea, Button, Modal, Select, FileInput, Spinner } from 'flowbite-react'
import { useEffect, useState } from 'react'
import styles from './EditProfileModal.module.scss'
import { useUser } from '../../api/users/useUser'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useUserUpdate from '../../api/users/useUserUpdate'
import useCountries from '../../hooks/useCountries'
import InterestsSelection from '../RHF/Location/InterestsSelection'
import LocationSelector from '../RHF/Location/LocationSelector'
import DragNDrop from '../RHF/DragNDrop'

export function EditProfileModal({ show, onClose }) {
  const { data: user } = useUser()
  const { mutateAsync: updateProfile, isSuccess, isPending } = useUserUpdate()

  // Define a schema for the location object
  const locationSchema = z.object({
    city: z.string().trim().max(30).optional(),
    country: z.string().trim().max(30).optional(),
    lat: z.string().optional(),
    long: z.string().optional()
  })

  const editProfileSchema = z
    .object({
      firstName: z.string().trim().min(2).max(30),
      lastName: z.string().trim().min(2).max(30),
      img: z.any().optional(),
      bio: z.string().optional(),
      location: locationSchema.optional(),
      interests: z.string().array()
    })
    .refine(
      ({ location }) => {
        if (location.city && location.country) {
          return location.lat && location.long
        }
        return true
      },
      {
        path: ['location.city'],
        message: 'City is required'
      }
    )

  const defaultValues = {
    ...user,
    location: {
      ...user.location,
      lat: user.location.geometry?.coordinates[0].toString(),
      long: user.location.geometry?.coordinates[1].toString()
    }
  }
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors }
  } = useForm({ resolver: zodResolver(editProfileSchema), defaultValues })

  const onSubmit = data => {
    updateProfile({ data, onSuccess: onClose })
  }

  return (
    <>
      <form>
        <Modal size="xl" position="center" {...{ show, onClose }}>
          <Modal.Header>
            <div>Edit Profile</div>
          </Modal.Header>
          <Modal.Body>
            <Label htmlFor="fname" value="First Name" className="mb-2 block" />
            <TextInput
              id="fname"
              type="text"
              className="mb-4 block"
              {...register('firstName')}
              color={errors.firstName ? 'failure' : 'gray'}
              helperText={errors.firstName?.message}
            />

            <Label htmlFor="lname" value="Last Name" className="mb-2 block" />
            <TextInput
              id="lname"
              type="text"
              className="mb-4 block"
              {...register('lastName')}
              color={errors.lastName ? 'failure' : 'gray'}
              helperText={errors.lastName?.message}
            />

            <Label htmlFor="bio" value="Bio" className="mb-2 block" />
            <Textarea
              id="bio"
              placeholder="Write description here..."
              className="mb-4 block"
              {...register('bio')}
              rows={4}
              color={errors.bio ? 'failure' : 'gray'}
              helperText={errors.bio?.message}
            />

            <Label value="Interests" className="mb-2 block" />
            <InterestsSelection {...{ control }} name="interests" />

            <Label value="Profile picture:" className="mb-2 block" />
            <DragNDrop {...{ register, watch }} name="img" txtFileType="SVG, PNG, JPG or GIF (MAX. 800x400px)" />

            <Label value="Address" className="mb-2 block" />
            <LocationSelector
              {...{ control }}
              names={{ city: 'location.city', country: 'location.country', lat: 'location.lat', long: 'location.long' }}
            />
          </Modal.Body>
          <Modal.Footer>
            <div className={styles.formActions}>
              <Button type="submit" className="button" disabled={isPending} onClick={handleSubmit(onSubmit)}>
                {isPending ? <Spinner /> : <>Save changes</>}
              </Button>
              <Button
                color="light"
                onClick={() => {
                  onClose()
                  reset()
                }}>
                Dismiss
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      </form>
    </>
  )
}
