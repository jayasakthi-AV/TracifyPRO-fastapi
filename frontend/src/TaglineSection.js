import React from 'react';
import './TaglineSection.css';

const TaglineSection = () => {
  return (
    <div className="tagline-card">
      <div className="tagline-content">
        <h3 className="tagline-title">📈 Plan. Track. Succeed.</h3>
        <p className="tagline-sub">
        Say goodbye to stock confusion—keep everything organized, updated, and under control.
        </p>

        <div className="company-badge">
          <span className="powered-by">Powered by</span>
          <span className="company-name">Tracify Pro</span>
        </div>
      </div>
    </div>
  );
};

export default TaglineSection;
