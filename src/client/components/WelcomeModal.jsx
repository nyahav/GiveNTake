import styles from './WelcomeModal.module.css';
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import InterestsSelection from './RHF/Location/InterestsSelection.jsx';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import LocationSelector from './RHF/Location/LocationSelector.jsx';
import useUserUpdate from '../api/users/useUserUpdate.jsx';


const InterestsLocationModal = () => {
  const { mutate: updateInterestsLocation } = useUserUpdate();
  const [showModal, setShowModal] = useState(true);


  const formSchema = z
    .object({
      location: z.object({
        city: z.string().trim().min(2).max(30),
        country: z.string().trim().min(2).max(30),
        lat: z.string(),
        long: z.string()
      }),
      interests: z.string().array(),
    });

  const { handleSubmit, control, formState: {isSubmitted, isSubmitting} } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { interests: [] }
  });

  const onSubmit = (data) => {
    console.log('onSubmit');
    console.log('Form data:', data);

    data = {
      ...data,
      flags:{
        hideWelcomeModal: true
      }
    };
    updateInterestsLocation({ data, onSuccess: () => setShowModal(false) });
  }

  useEffect(() => {
    // on modal close make sure it won't show again and save this as a flag in the DB.
    if(!showModal && !isSubmitted && !isSubmitting){

      const data = {
        flags:{
          hideWelcomeModal: true
        }
      };
      updateInterestsLocation({ data });
    }
  }, [showModal]);

  return (
    <>
      <form>
        <Modal theme={{ content: { base: 'w-3/4' } }} size="xl" position="center" dismissible show={showModal} onClose={() => setShowModal(false)}>
          <Modal.Header>
            <div className={styles.title}>Thank you for joining!</div>
            <div className={styles.subtitle}>To get a more presonalized experience, we would like to know a little more about you</div>
          </Modal.Header>
          <Modal.Body>
            <div className={styles.body}>

              <label>Where are you located?</label>
              <LocationSelector {...{ control }} names={{ city: 'location.city', country: 'location.country', lat: 'location.lat', long: 'location.long' }} />

              <label>What are your interests? Select the ones you like</label>
              <InterestsSelection {...{ control }} name='interests' />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleSubmit(onSubmit)} className='button'>Save</Button>
            <Button color="gray" onClick={() => setShowModal(false)}>Later</Button>
          </Modal.Footer>
        </Modal>
      </form>
    </>
  );
}

export default InterestsLocationModal;