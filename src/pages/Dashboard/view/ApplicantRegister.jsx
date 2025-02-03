import { Modal, Form, Button } from "react-bootstrap";
import {IoClose} from "react-icons/io5"
import logo from "../../../assets/images/logo.png";
import useAdmissionStore from "../../../store/admission/useAdmissionStore";
import ReactLoading from "react-loading";
import useAuthStore from "../../../store/authentication/authStore";
import Swal from "sweetalert2";
const ApplicantRegister = ({ show, setShow }) => {
  const {
    isLoading,
    scheduleSlots,
    setGradeLevel,
    clearApplicantRegister,
    applicants,
    setApplicantsFullName,
    submitApplicantRegister,
  } = useAdmissionStore();
  const { firstName, middleName, lastName, gradeLevel } = applicants;
  const { user } = useAuthStore();

  const handleClose = () => {
    setShow(false);
  };

  const handleSubmit = async () => {
    const formBody = {
      level_applying: gradeLevel,
      fname: firstName,
      mname: middleName,
      lname: lastName,
    };

    const formResponse = await submitApplicantRegister({formBody});

    if (formResponse.status === 200) {
      if (formResponse.message === "Admission data found") {
        Swal.fire({
          title: "Duplicate Application found!",
          text: "Application has been connected to your account.",
          icon: "info",
        });
      } else if (formResponse.message === "New admission record created") {
        Swal.fire({
          title: "Application created",
          text: "Please accomplish the requirements.",
          icon: "success",
        });
      }

      handleClose();
    }
  };

  const handleChangeInput = (field, value) => {
    console.log({
      field: field,
      value: value,
    });

    setApplicantsFullName({ [field]: value });
  };

  const handleCloseButton = () => {
    setShow(false)
  }

  return (
    <>
      <Modal show={show} onHide={handleClose} id="modal-container" centered>
        <Modal.Header className="border-none justify-end">
          <button 
            onClick={handleCloseButton}
          >
            <IoClose size={30} className="me-7"/>
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="logo-modal-container">
            <img src={logo} className="logo-modal" />
            <h2 className="text-modal-heading">Applicant Registration</h2>
            <h3 className="text-modal-subheading">
              Please register the applicant's name and intended grade level
            </h3>
            {isLoading ? (
              <ReactLoading
                className="app-loader"
                type={"bubbles"}
                color="#012169"
              />
            ) : null}
          </div>
          <div className="modal-form-container">
            <Form.Group controlId="gradeLevel" className="mt-3">
              <Form.Label>Level Applying For</Form.Label>
              <Form.Select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                required
                disabled={isLoading}
              >
                <option value="" disabled>
                  Select grade level
                </option>
                {scheduleSlots?.map(({ level, available }) => (
                  <option
                    key={level}
                    value={level}
                    disabled={isLoading || !available}
                  >
                    {level}{" "}
                    {isLoading || !available ? "- slots unavailable" : ""}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                setShow(false);
                handleSubmit();
                // addApplicant();
                clearApplicantRegister();
              }}
            >
              <Form.Group controlId="surname">
                <Form.Label id="applicant-name-label">
                  Applicant Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter surname"
                  value={lastName}
                  onChange={(e) =>
                    handleChangeInput("lastName", e.target.value)
                  }
                  required
                />
              </Form.Group>
              <Form.Group controlId="firstName" className="mt-1">
                <Form.Label></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) =>
                    handleChangeInput("firstName", e.target.value)
                  }
                  required
                />
              </Form.Group>
              <Form.Group controlId="middleName" className="mt-1">
                <Form.Label></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter middle name"
                  value={middleName}
                  onChange={(e) =>
                    handleChangeInput("middleName", e.target.value)
                  }
                />
              </Form.Group>

              <hr className="h-[1px] mx-auto mt-[3.5em]" />
              <div className="button-group-container">
                <Button variant="primary" type="submit" className="mt-4 w-full">
                  Register
                </Button>
                {/* <Button
                  variant="secondary"
                  className=" w-50"
                  onClick={() => {
                    if (user["registryType"] != "learner") {
                      clearApplicantRegister();
                    }
                    setShow(false);
                  }}
                >
                  Cancel
                </Button> */}
              </div>
            </Form>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ApplicantRegister;
