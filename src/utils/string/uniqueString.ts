import { getDateTimeStamp } from '../datetime';

export default function uniqueString() {
  return (
    getDateTimeStamp().toString(36) +
    Math.floor(Math.random() * 999999).toString(36)
  );
}
