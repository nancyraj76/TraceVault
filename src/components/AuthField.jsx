function AuthField({ id, label, icon: Icon, children, hint, error, className = '' }) {
  return (
    <div className={`auth-field${className ? ` ${className}` : ''}`}>
      <label className="auth-field-label" htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        {Icon && <Icon className="auth-input-icon" size={17} strokeWidth={1.8} aria-hidden="true" />}
        {children}
      </div>
      {error ? (
        <span className="auth-field-error" id={`${id}-error`} role="alert">{error}</span>
      ) : hint && <span className="auth-field-hint">{hint}</span>}
    </div>
  )
}

export default AuthField
