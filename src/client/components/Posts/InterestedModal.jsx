import { Label, Modal, Textarea, Select, Button, ModalFooter } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePostAction } from '../../api/posts/usePostAction';
import styles from './InterestedModal.module.scss';
import { REPORTS_REASONS } from '../../utils/staticData';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const preWrittenMessages = [
  "I'm interested to help.",
  'Do you still need help?',
  'Maybe I can help, can you give more information?'
];

const InterestedModal = ({
  show,
  onClose,
  postId,
  fullName,
  isUserInterested,
  onPostAction,
  userId
}) => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  let isNavigated = false;

  const interestedHandler = () => {
    onPostAction({
      postId,
      actions: {
        isUserInterested: !isUserInterested
      }
    });

    onClose();

    navigate('/messages', { state: { interestedInPost: { message, postId, userId } } });
  };

  return (
    <>
      <form>
        <Modal dismissible show={show} onClose={onClose}>
          <Modal.Header style={{ margin: 0, fontWeight: 500 }}>
            Send message to {fullName}
          </Modal.Header>
          <Modal.Body>
            <div className={styles.preWrittenMessagesWrap}>
              {preWrittenMessages.map((message) => (
                <Button key={message} color="gray" onClick={() => setMessage(message)}>
                  {message}
                </Button>
              ))}
            </div>

            <Textarea
              placeholder="Type your message to the post creator"
              rows={4}
              className="mb-4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button type="submit" className="button" onClick={interestedHandler}>
              Send Message
            </Button>
            <Button color="light" onClick={onClose}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </form>
    </>
  );
};

export default InterestedModal;
