import React from "react";

const ContactsSection: React.FC = () => {
  return (
    <section className="py-5 bg-white border-top">
      <div className="container-fluid">
        <h2 className="mb-5 text-center">Susisiekite su mumis</h2>
        <div className="row justify-content-center">
          {/* Kontaktai Column */}
          <div className="col-md-6 col-lg-5 mb-4">
            <h4 className="mb-3">Kontaktai</h4>
            <ul className="list-group list-group-flush fs-5">
              <li className="list-group-item">
                <strong>El. paštas:</strong>{" "}
                <a className="text-decoration-none text-dark" href="mailto:info@fake-mail.lt">
                  info@fake-mail.lt
                </a>
              </li>
              <li className="list-group-item">
                <strong>Tel.:</strong>{" "}
                <a className="text-decoration-none text-dark" href="tel:+37060000000">
                  +370 600 00000
                </a>
              </li>
              <li className="list-group-item">
                <strong>Adresas:</strong> Liepų g. 34, Garliava
              </li>
              <li className="list-group-item">
                <strong>Darbo laikas:</strong> I–V 8:00–17:00
              </li>
            </ul>
          </div>

          {/* Įmonės informacija Column */}
          <div className="col-md-6 col-lg-5 mb-4">
            <h4 className="mb-3">Įmonės informacija</h4>
            <ul className="list-group list-group-flush fs-5">
              <li className="list-group-item">
                <strong>Įmonės kodas:</strong> 123456789
              </li>
              <li className="list-group-item">
                <strong>PVM kodas:</strong> LT123456789
              </li>
              <li className="list-group-item">
                <strong>Facebook:</strong>{" "}
                <a className="text-decoration-none text-dark" href="https://facebook.com/fakepage" target="_blank" rel="noopener noreferrer">
                  facebook.com/fakepage
                </a>
              </li>
              <li className="list-group-item">
                <strong>Instagram:</strong>{" "}
                <a className="text-decoration-none text-dark" href="https://instagram.com/fakeprofile" target="_blank" rel="noopener noreferrer">
                  @fakeprofile
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactsSection;
