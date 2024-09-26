import { Link } from 'react-router-dom';
import s from './EmptyState.module.scss';
const EmptyState = ({ title, img, content, link }) => {
  return (
    <div className={s.emptyState}>
      <img src={img} />
      <h5>{title}</h5>
      {content && <p>{content}</p>}
      {link && <p className={s.link}>{link}</p>}
    </div>
  );
};

export default EmptyState;
