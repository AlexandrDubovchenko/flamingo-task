import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { FolderOpen } from 'lucide-react';
import { SignoutButton } from '@/features/auth/components/SignoutButton';

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='container mx-auto px-4'>
        <div className='flex h-16 items-center justify-between'>
          <div className='flex items-center space-x-4'>
            <div className='flex items-center space-x-2'>
              <Badge variant='default' className='bg-blue-600'>
                TaskFlow
              </Badge>
            </div>

            <div className='flex items-center space-x-2'>
              <Link to='/app/projects'>
                <Button
                  variant={isActive('/app/projects') ? 'default' : 'ghost'}
                  size='sm'
                  className='flex items-center gap-2'
                >
                  <FolderOpen className='h-4 w-4' />
                  Projects
                </Button>
              </Link>
            </div>
          </div>

          <div className='flex items-center space-x-2'>
            <SignoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
