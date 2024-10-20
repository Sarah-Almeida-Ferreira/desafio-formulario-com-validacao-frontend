import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { JOB_POSITIONS } from "../../consts/jobPositions.const";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";

const sanitizeUrl = (url) => url.replace(/^https?:\/\//, "");

const MemberCard = ({ onClose }) => {
  const [memberData, setMemberData] = useState(null);

  useEffect(() => {
    const register = sessionStorage.getItem("memberData");
    if (register) {
      setMemberData(JSON.parse(register));
    }
  }, []);

  if (!memberData) {
    return null;
  }

  const jobPositionLabel = JOB_POSITIONS.find(
    (opt) => opt.key === memberData.jobPosition
  )?.label;

  return (
    <section className="md:max-w-2xl m-auto">
      <div className="card">
        <div className="card-label">
          <h1 className="card-title">{memberData.fullName}</h1>
          <p className="card-subtitle">{jobPositionLabel}</p>
        </div>
        <div className="card-body">
          <ContactInfo icon={faEnvelope} info={memberData.email} />
          <ContactInfo icon={faPhone} info={memberData.phone} />
          {memberData.linkedin && (
            <ContactInfo
              icon={faLinkedin}
              info={sanitizeUrl(memberData.linkedin)}
            />
          )}
          {memberData.github && (
            <ContactInfo
              icon={faGithub}
              info={sanitizeUrl(memberData.github)}
            />
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={onClose}
        data-testid="new-member-button"
        className="button mt-5"
      >
        Cadastrar novo membro
      </button>
    </section>
  );
};

const ContactInfo = ({ icon, info }) => (
  <p>
    <FontAwesomeIcon icon={icon} className="mr-5" />
    {info}
  </p>
);

ContactInfo.propTypes = {
  icon: PropTypes.object.isRequired,
  info: PropTypes.string.isRequired,
};

MemberCard.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default MemberCard;
