import '@/components/Layout/Header/WindowUser/UserInfo/styles/user-info.scss';
import '@/components/Layout/Header/WindowUser/UserInfo/styles/button-userinfo.scss';

export const UserInfo = ({ user, onSignOut }: { user: any; onSignOut: () => void }) => {
  return (
    <div className="user-info">
      <div className="user-info__inner">
        <div className="user-info__header">
          <div className="user-info__name">{user.name}</div>
          <div className="user-info__mail _en">{user.email}</div>
        </div>
        <div className="user-info__buttons">
          <button className="button-userinfo _en" onClick={onSignOut}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};
