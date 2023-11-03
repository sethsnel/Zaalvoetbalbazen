import { useRouter } from "next/router";
import { useState } from "react";
import { useSessionData } from "../lib/seasonDBO";
import { useUser } from "../lib/useUser";

const RegisterGuest = ({
  hasntResponded,
}: {
  hasntResponded?: boolean;
}): JSX.Element => {
  const router = useRouter()
  const [guestUser, setGuestUser] = useState<undefined | string>(undefined);
  const { user } = useUser()
  const { registerGuest } = useSessionData(router.query.season as string, router.query.session as string)

  if (hasntResponded) return <></>;

  const submitRegisterGuest = () => {
    if (guestUser) {
      registerGuest(user?.id ?? '', guestUser)
      setGuestUser(undefined)
    }
  }

  let inputComponent = (
    <a
      href="#"
      className="link-secondary link-underline-secondary text-decoration-underline"
      onClick={(e) => {
        setGuestUser("");
      }}
    >
      Gast aanmelden
    </a>
  );

  if (guestUser !== undefined) {
    inputComponent = (
      <div className="input-group input-group-sm">
        <input
          className="form-control"
          list="datalistOptions"
          id="guestUser"
          type="text"
          placeholder="Naam van Gast"
          onChange={(e) => setGuestUser(e.currentTarget.value)}
        />
        <button className="btn btn-outline-primary" type="button" onClick={submitRegisterGuest}>
          Aanmelden
        </button>
      </div>
    );
  }

  return <div className="container-sm">{inputComponent}</div>;
};

export default RegisterGuest;
