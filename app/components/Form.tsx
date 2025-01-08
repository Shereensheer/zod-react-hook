import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormData, UserSchema, ValidFieldNames } from "@/types";
import axios from "axios";
import FormField from "./FormField";

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(UserSchema), // Apply the Zod schema resolver
  });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post("/api/form", data); // Make a POST request
      const { errors: serverErrors } = response.data; // Destructure 'errors' from server response

      // Define a mapping between server-side field names and their corresponding client-side names
      const fieldErrorMapping: Record<string, ValidFieldNames> = {
        email: "email",
        githubUrl: "githubUrl",
        yearsOfExperience: "yearsOfExperience",
        password: "password",
        confirmPassword: "confirmPassword",
      };

      // Loop through serverErrors and set errors in the form
      if (serverErrors) {
        Object.keys(serverErrors).forEach((serverField) => {
          const clientField = fieldErrorMapping[serverField];
          if (clientField) {
            setError(clientField, {
              type: "server",
              message: serverErrors[serverField],
            });
          }
        });
      }
    } catch (error) {
      console.error("Submitting form failed:", error);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid col-auto text-black">
        <h1 className="text-3xl font-bold mb-4">Zod & React-Hook-Form</h1>
        <FormField
          type="email"
          placeholder="Email"
          name="email"
          register={register}
          error={errors.email}
        />
        <FormField
          type="text"
          placeholder="GitHub URL"
          name="githubUrl"
          register={register}
          error={errors.githubUrl}
        />
        <FormField
          type="number"
          placeholder="Years of Experience (1 - 10)"
          name="yearsOfExperience"
          register={register}
          error={errors.yearsOfExperience}
          valueAsNumber
        />
        <FormField
          type="password"
          placeholder="Password"
          name="password"
          register={register}
          error={errors.password}
        />
        <FormField
          type="password"
          placeholder="Confirm Password"
          name="confirmPassword"
          register={register}
          error={errors.confirmPassword}
        />
        <button type="submit" className="submit-button">
          Submit
        </button>
      </div>
    </form>
  );
}

export default Form;
