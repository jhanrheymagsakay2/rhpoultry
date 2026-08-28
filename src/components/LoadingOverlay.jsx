export default function LoadingOverlay({ show }) {
  return (
    <div className={`loading-overlay ${show ? 'active' : ''}`}>
      <div className="spinner" />
    </div>
  )
}
