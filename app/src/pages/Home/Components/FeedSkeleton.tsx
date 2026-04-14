function FeedSkeleton() {
  return (
    <div className="home-container">
      <div className="feed-header">
        <h1>StudyHub Feed</h1>
        <p>Fedezd fel a legfrissebb jegyzeteket a közösségtől!</p>
      </div>

      <div className="feed-controls">
        <div className="search-container">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input type="text" placeholder="Keresés jegyzetekre, kurzusokra..." className="search-input" disabled />
        </div>
      </div>

      <div className="skeleton-loader">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="skeleton-card">
            <div className="skeleton-header">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-info">
                <div className="skeleton-line skeleton-name"></div>
                <div className="skeleton-line skeleton-course"></div>
              </div>
              <div className="skeleton-line skeleton-date"></div>
            </div>
            <div className="skeleton-content">
              <div className="skeleton-line skeleton-title"></div>
              <div className="skeleton-line skeleton-text"></div>
              <div className="skeleton-line skeleton-text"></div>
            </div>
            <div className="skeleton-actions">
              <div className="skeleton-button"></div>
              <div className="skeleton-button"></div>
              <div className="skeleton-button"></div>
              <div className="skeleton-button"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedSkeleton;
