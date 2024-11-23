import RegistrationForm from "@/components/RegistrationForm";


export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-8 bg-indigo-700 min-h-screen ">
      <h1 className="text-3xl font-bold mb-6 text-center">Hackathon Registration</h1>
      <RegistrationForm />
    </div>
  )
}

