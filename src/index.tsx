import React, { useEffect, useState, FC } from 'react';
import * as ReactDOM from 'react-dom';
import { useAuthenticatedUser } from './hooks/useAuthenticatedUser';
import { Login } from './Login';

const App: FC = () => {
  const [user, credentials] = useAuthenticatedUser();
  const [namespaces, setNamespaces] = useState<string[]>([]);
  useEffect(() => {
    if (!credentials) {
      return;
    }
    (async () => {
      const res = await fetch('/api/eks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      const namespaces = await res.json();
      setNamespaces(namespaces);
    })();
  }, [credentials]);

  const payload = user
    ?.getSignInUserSession()
    ?.getIdToken()
    .decodePayload();

  return (
    <div>
      <Login user={user} />
      {payload && (
        <div>
          <h3>User</h3>
          <p>{user?.getUsername()}</p>
          <h3>Groups</h3>
          <p>{payload['cognito:groups']}</p>
          <h3>Roles</h3>
          <p>{payload['cognito:roles']}</p>
        </div>
      )}
      {namespaces.length > 0 && (
        <>
          <h3>Namespaces</h3>
          <ul>
            {namespaces.map(namespace => (
              <li key={namespace}>{namespace}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
