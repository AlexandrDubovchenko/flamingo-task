import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ProjectsPage } from './pages/projects';
import { ProjectDetailsPage } from './pages/projects/details';
import { Navigation } from './shared/components/Navigation';
import { LoginPage } from './pages/login';
import { useAuthContext } from './features/auth/context/auth';

function App() {
  const { isAuthorized } = useAuthContext();
  return (
    <div className='min-h-screen bg-background'>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/' element={<Navigate to='/app/projects' replace />} />
          {!isAuthorized ? (
            <Route path='/app/*' element={<Navigate to='/login' replace />} />
          ) : (
            <Route
              path='/app/*'
              element={
                <>
                  <Navigation />
                  <main>
                    <Routes>
                      <Route path='projects' element={<ProjectsPage />} />
                      <Route
                        path='projects/:id'
                        element={<ProjectDetailsPage />}
                      />
                    </Routes>
                  </main>
                </>
              }
            />
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
