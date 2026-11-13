function AuthField({ id, label, icon: Icon, children, hint, className = '' }) {
  return (
    <div className={`auth-field${className ? ` ${className}` : ''}`}>
      <label className="auth-field-label" htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        {Icon && <Icon className="auth-input-icon" size={17} strokeWidth={1.8} aria-hidden="true" />}
        {children}
      </div>
      {hint && <span className="auth-field-hint">{hint}</span>}
    </div>
  )
}

export default AuthField
