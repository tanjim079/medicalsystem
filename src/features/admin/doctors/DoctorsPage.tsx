import AddDoctorForm from "./AddDoctorForm";
import DoctorList from "./DoctorList";

export default function DoctorsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        Doctor Management
      </h1>

      <AddDoctorForm />
      <DoctorList />
    </>
  );
}