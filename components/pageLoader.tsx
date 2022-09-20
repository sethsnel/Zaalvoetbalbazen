const PageLoader = ({fullscreen}: { fullscreen?:boolean}) => {
    return <div className={`d-flex justify-content-center align-items-center ${!fullscreen && 'mt-3'}`} style={{ height: fullscreen ? '100vh' : 'inherit' }}>
    <div className="spinner-border" role="status" style={{ width: '4rem', height: '4rem' }}>
      <span className="visually-hidden">App laden...</span>
    </div>
  </div>
}

export default PageLoader