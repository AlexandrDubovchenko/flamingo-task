import { API_CONFIG, API_ENDPOINTS } from '@/shared/config/api';

export function useSignInWithGithub() {
  const signInWithGithub = () => {
    const popup = window.open(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.GITHUB}`,
      'GitHub Login',
      'width=600,height=600'
    );
    return new Promise<string>((res, rej) => {
      const listener = (event: MessageEvent) => {
        if (event.origin !== API_CONFIG.BASE_URL) return;
        if (event.data?.token) {
          window.removeEventListener('message', listener);
          popup?.close();
          res(event.data.token);
        } else {
          rej(new Error('GitHub login failed'));
        }
      };
      window.addEventListener('message', listener);
    });
  };

  return { signInWithGithub };
}
