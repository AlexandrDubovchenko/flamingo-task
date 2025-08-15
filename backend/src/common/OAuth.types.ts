export interface GithubProfile {
  id: string; // GitHub user ID
  username: string; // GitHub username
  displayName?: string; // Full name (may be null)
  profileUrl?: string; // GitHub profile URL
  emails?: { value: string; verified?: boolean }[]; // Array of emails
  photos?: { value: string }[]; // Array of avatar URLs
  provider: 'github';
  _json?: any; // Raw GitHub API response
  _raw?: string; // Raw JSON string
}
