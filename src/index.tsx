import React, { useEffect, useState, FC } from 'react';
import * as ReactDOM from 'react-dom';
import { useLoginUser } from './hooks/useLoginUser';
import { Login } from './Login';

const App: FC = () => {
  const [user, credentials] = useLoginUser();
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

  return (
    <div>
      <Login user={user} />
      <ul>
        {namespaces.map(namespace => (
          <li key={namespace}>{namespace}</li>
        ))}
      </ul>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
