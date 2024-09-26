import s from "./EmailVerification.module.scss";
import { Button, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { Spinner } from "flowbite-react";
import { IoMdArrowRoundBack } from "react-icons/io";

const EmailVerification = ({ onVerify, isVerifying, onReturn }) => {
  const [code, setCode] = useState("");

  return (
    <div className={s.emailVerification}>
    <IoMdArrowRoundBack className={s.btnReturn} onClick={onReturn} />

      <h2>Verify your email</h2>
      <div>
        <div className="mb-2 block">
          <Label
            htmlFor="code"
            value="Check your inbox and enter the code you received:"
          />
        </div>
        <TextInput onChange={(e) => setCode(e.target.value)} required />
      </div>
      <Button
        onClick={() => onVerify(code)}
        disabled={isVerifying}
        className="button"
      >
        <span className="mr-">{isVerifying ? "Verifying... " : "Verify"}</span>
        {isVerifying && <Spinner />}
      </Button>
    </div>
  );
};

export default EmailVerification;
