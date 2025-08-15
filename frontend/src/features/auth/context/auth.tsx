import {
  createContext,
  useContext,
  useState,
  type FC,
  type PropsWithChildren,
} from 'react';

const AuthContext = createContext<{
  isAuthorized: boolean;
  setIsAuthorized: (isAuthorized: boolean) => void;
}>({
  isAuthorized: Boolean(localStorage.getItem('authToken')),
  setIsAuthorized: () => {},
});

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  return (
    <AuthContext.Provider value={{ isAuthorized, setIsAuthorized }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
