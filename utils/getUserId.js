import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';

export function getUserId() {
  let userId = Cookies.get('user_id');

  if (!userId) {
    userId = uuidv4();
    Cookies.set('user_id', userId, { expires: 365 }); // expires in 1 year
  }

  return userId;
}
