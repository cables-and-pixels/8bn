import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';

export default function TwitterLink(props) {
  return (
    <a href={`https://twitter.com/${props.name}`}
       target="_blank" rel="noreferrer">
      <FontAwesomeIcon icon={faTwitter} />{' '}
      {props.name}
    </a>
  );
}
