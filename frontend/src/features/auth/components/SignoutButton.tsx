import { Button } from '@/shared/ui';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/auth';

export function SignoutButton() {
  const navigate = useNavigate();
  const { setIsAuthorized } = useAuthContext();
  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    setIsAuthorized(false);
    navigate('/login', { replace: true });
  };
  return (
    <Button variant='outline' size='sm' onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
