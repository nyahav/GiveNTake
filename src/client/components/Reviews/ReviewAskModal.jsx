import { Button, Label, Modal, TextInput, Dropdown, Select, Textarea } from 'flowbite-react'
import { useState, useMemo } from 'react'
import { useSnackbar } from 'notistack'
import { Rating, Star } from '@smastrom/react-rating'
import '@smastrom/react-rating/style.css'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useCreateReview } from '../../api/reviews/useCreateReview'
import { zodResolver } from '@hookform/resolvers/zod'

// fromUser: ObjectId,
// rating: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 5
// },
// description: { type: String },
// createdAt: { type: Date },

export function ReviewAskModal({ show, onClose, toUser, postId }) {
  const { mutateAsync: createReview } = useCreateReview()
  const reviewAskSchema = z.object({
    rating: z.number().min(1).max(5),
    description: z.string().optional()
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      rating: 0
    },
    resolver: zodResolver(reviewAskSchema)
  })

  const onSubmit = data => {
    const review = {
      ...data,
      toUser: toUser,
      postId: postId
    }

    createReview({ data: review, closeModal: onClose })
  }

  return (
    <>
      <Modal {...{ show, onClose }} size="md" popup>
        <Modal.Header className="mt-2 ml-2">Tell us a bit how was it</Modal.Header>
        <Modal.Body>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Label className="block" htmlFor="rating" value="1. Rate the experience" />
            <Rating className="mb-4" onChange={value => setValue('rating', value)} value={watch('rating')} />

            <Label className="mb-2 block" htmlFor="description" value="2. What did you like/improve?" />
            <Textarea
              id="description"
              placeholder="Write a review..."
              className="mb-4"
              rows={4}
              {...register('description')}
            />
            <div className="w-full">
              <Button type="submit" className="button">
                Submit your review
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  )
}
