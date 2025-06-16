import React from "react";
import { CheckCircle } from "lucide-react"; 
import { Link } from "react-router-dom";


interface SuccessPaymentWindowProps {
  /** Function to call when closing the window (optional) */
  onClose?: () => void;
}

/**
 * Success payment dialog styled using global modal classes from styles.css
 * (modal-backdrop, modal, modal-actions, btn). Matches other pages.
 */
const SuccessPaymentWindow: React.FC<SuccessPaymentWindowProps> = ({ onClose = () => {} }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {/* Success icon */}
        <div style={{ marginBottom: '1rem' }}>
          <CheckCircle size={48} className="free" />
        </div>

        {/* Heading */}
        <h2 style={{ marginBottom: '0.5rem' }}>Mokėjimas sėkmingas!</h2>

        {/* Description */}
        <p style={{ marginBottom: '1.5rem' }}>
          Apmokėjimas už sąskaitą sėkmingai gautas
        </p>

        {/* Actions */}
        <div className="modal-actions">

          <Link to="/invoices" className="btn">↩ Grįžti</Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPaymentWindow;
