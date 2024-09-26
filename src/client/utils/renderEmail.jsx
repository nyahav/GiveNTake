import { render } from '@react-email/render';
import React from 'react';
import GiventakeWelcome from '../emails/GiventakeWelcome.jsx';

const RenderEmail = (userName) => {
  const html = render(<GiventakeWelcome name={userName}/>);
  return html;
};

export default RenderEmail;