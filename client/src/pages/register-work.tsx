import Header from "@/components/layout/header";
import WorkRegistrationForm from "@/components/works/work-registration-form";

export default function RegisterWork() {
  return (
    <>
      <Header
        title="Register New Work"
        description="Add a new musical work to the system"
      />
      <div className="p-6">
        <WorkRegistrationForm />
      </div>
    </>
  );
}
