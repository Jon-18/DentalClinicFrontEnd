import "../../style/components/adminstyle/addclinicservices.css";
import BranchRegistration from './clinicServicesRegistration/BranchRegistration.jsx';
import ServiceRegistration from "./clinicServicesRegistration/ServiceRegistration.jsx";

const AddClinicServices = () => {
  return (
    <div className="clinic-container">
      <BranchRegistration />
      <ServiceRegistration/>
    </div>
  );
};

export default AddClinicServices;
