import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export function useCurrentUser() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const getUserId = () => {
    if (!user?.id) {
      addToast('Please log in to access this feature', 'warning');
      navigate('/login');
      return null;
    }
    return user.id;
  };

  return { userId: user?.id, getUserId };
}
