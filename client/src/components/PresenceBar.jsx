import './PresenceBar.css';

function PresenceBar(props) {
  const users = props.users || [];

  if (users.length === 0) return null;

  return (
    <div className="presence-bar">
      <span className="presence-label">Viewing now:</span>
      <div className="presence-avatars">
        {users.map(function (email, index) {
          const initial = email ? email.charAt(0).toUpperCase() : '?';
          return (
            <span className="presence-avatar" key={email + index} title={email}>
              {initial}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default PresenceBar;
