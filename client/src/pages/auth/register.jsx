import CommonForms from "@/components/common/CommonForms";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const initialState = {
  username: '',
  email: '',
  password: ''
}

function AuthRegister() {

  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function onSubmit(e) {
    e.preventDefault()

    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast.success(data.payload.message)
      } else {
        toast.error(data.payload.message)
      }
      navigate("/login")
    })
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Sign up</h1>
        <p className="mt-2">Already have an account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to='/login'
          >
            Login!
          </Link>
        </p>
      </div>
      <CommonForms
        formControls={registerFormControls}
        buttonText={'Sign up'}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthRegister;