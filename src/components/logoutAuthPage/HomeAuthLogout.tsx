import { useAuth } from "../../hooks/useAuth";
import "./style.scss";

export function AuthHomePageLogoutAccount(): JSX.Element {
  const { user, logoutPage } = useAuth();

  if(user) {
    return (
      <div id="auth-page-logout">
        <div>
          {user && (
            <div className="user-info">
              <img src={user.avatar} alt={`Avatar de ${user.name}`} />
              <span>Você está logado como {user.name}</span>
            </div>
          )}
        </div>

        {user && (
          <button type="button" onClick={logoutPage}>
            Logout - Sair da página
          </button>
        )}
      </div>
    );
  }

  return(
    <div></div>
  )
}