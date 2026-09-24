import React from 'react';
import { track } from '../utils/track';

/** One file, one event. Every resume link on the site goes through here. */
export const RESUME_PATH = '/resume.pdf';
export const RESUME_FILENAME = 'Kaminski_Resume.pdf';

interface ResumeLinkProps {
  /** Where on the site the click came from; becomes the `source` on `Resume Downloaded`. */
  source: string;
  className?: string;
  children: React.ReactNode;
}

const ResumeLink: React.FC<ResumeLinkProps> = ({ source, className, children }) => (
  <a
    href={RESUME_PATH}
    download={RESUME_FILENAME}
    onClick={() => track('Resume Downloaded', { source })}
    className={className}
  >
    {children}
  </a>
);

export default ResumeLink;
