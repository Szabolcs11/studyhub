import { useNavigate } from "react-router-dom";
import { useCourses } from "../../hooks/useCourses";
import { PATHS } from "../../navigator/Routes";
import { SearchBar } from "../../components/SearchBar/SearchBar";

function Courses() {
  const navigate = useNavigate();
  const {
    universities,
    originalUniversities,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    expandedUniversities,
    expandedFaculties,
    toggleUniversity,
    toggleFaculty,
    expandAll,
    collapseAll,
    refetch,
  } = useCourses();

  const handleCourseClick = (courseId: number, courseName: string) => {
    navigate(PATHS.COURSES + courseId, { state: { courseName } });
  };

  if (isLoading) {
    return (
      <div className="courses-layout">
        <div className="courses-container">
          <div className="courses-header">
            <h1 className="courses-title">Kurzusok</h1>
            <p className="courses-subtitle">Válassz egyetemet és tantárgyakat</p>
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
              disabled={isLoading}
            />
          </div>
          <div className="courses-content">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <div className="loading-text">Kurzusok betöltése...</div>
              <div className="loading-subtext">Egy pillanat, összegyűjtjük az elérhető kurzusokat</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="courses-layout">
        <div className="courses-container">
          <div className="courses-header">
            <h1 className="courses-title">Kurzusok</h1>
            <p className="courses-subtitle">Válassz egyetemet és tantárgyakat</p>
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery}
            />
          </div>
          <div className="courses-content">
            <div className="error-container">
              <svg className="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <div className="error-title">Hiba történt</div>
              <div className="error-message">{error}</div>
              <button className="retry-button" onClick={refetch}>
                Újra próbálom
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (universities.length === 0 && !isLoading && !error) {
    if (searchQuery) {
      return (
        <div className="courses-layout">
          <div className="courses-container">
            <div className="courses-header">
              <h1 className="courses-title">Kurzusok</h1>
              <p className="courses-subtitle">
                {originalUniversities.reduce(
                  (acc, uni) => acc + uni.Faculties.reduce((facAcc, fac) => facAcc + fac.Courses.length, 0),
                  0,
                )}{" "}
                kurzus {originalUniversities.length} egyetemen
              </p>
              <SearchBar 
                value={searchQuery} 
                onChange={setSearchQuery}
              />
              <div className="search-result-count">Nincs találat</div>
            </div>
            <div className="courses-content">
              <div className="no-results">
                <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <div className="no-results-title">Nincs találat</div>
                <div className="no-results-message">
                  "{searchQuery}" kifejezésre nem található egyetem, kar vagy kurzus.
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="courses-layout">
          <div className="courses-container">
            <div className="courses-header">
              <h1 className="courses-title">Kurzusok</h1>
              <p className="courses-subtitle">Válassz egyetemet és tantárgyakat</p>
            </div>
            <div className="courses-content">
              <div className="empty-container">
                <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                <div className="empty-title">Nem található kurzus</div>
                <div className="empty-message">Jelenleg nincsenek elérhető kurzusok a rendszerben.</div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="courses-layout">
      <div className="courses-container">
        <div className="courses-header">
          <h1 className="courses-title">Kurzusok</h1>
          <p className="courses-subtitle">
            {originalUniversities.reduce(
              (acc, uni) => acc + uni.Faculties.reduce((facAcc, fac) => facAcc + fac.Courses.length, 0),
              0,
            )}{" "}
            kurzus {originalUniversities.length} egyetemen
          </p>
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery}
          />
          {searchQuery && (
            <div className="search-result-count">
              {universities.length === 0 
                ? "Nincs találat" 
                : `${universities.length} egyetem található`}
            </div>
          )}
          <div className="courses-controls">
            <button className="control-button" onClick={expandAll}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
              Minden kinyitása
            </button>
            <button className="control-button" onClick={collapseAll}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
              Minden bezárása
            </button>
          </div>
        </div>

        <div className="courses-content">
          <div className="tree-container">
            {universities.map((university) => {
              const isExpanded = expandedUniversities.has(university.Id);
              const totalCourses = university.Faculties.reduce((acc, faculty) => acc + faculty.Courses.length, 0);

              return (
                <div key={university.Id} className={`tree-item ${searchQuery ? 'search-highlight' : ''}`}>
                  <div className="tree-header" onClick={() => toggleUniversity(university.Id)}>
                    <div className="tree-header-content">
                      <svg
                        className={`tree-icon ${isExpanded ? "expanded" : ""}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      <div className="tree-info">
                        <div className="tree-title">{university.Name}</div>
                        {university.Description && <div className="tree-description">{university.Description}</div>}
                      </div>
                    </div>
                    <div className="tree-badge">{totalCourses} kurzus</div>
                  </div>

                  <div className={`tree-content ${isExpanded ? "expanded" : ""}`}>
                    <div className="tree-children">
                      {university.Faculties.length === 0 ? (
                        <div className="course-item">
                          <div className="course-info">
                            <div className="course-name">Nem található kar</div>
                            <div className="course-description">
                              Ehhez az egyetemhez még nincsenek hozzárendelve karok.
                            </div>
                          </div>
                        </div>
                      ) : (
                        university.Faculties.map((faculty) => {
                          const isFacultyExpanded = expandedFaculties.has(faculty.Id);

                          return (
                            <div key={faculty.Id} className={`tree-item ${searchQuery ? 'search-highlight' : ''}`}>
                              <div
                                className="tree-header"
                                onClick={() => toggleFaculty(faculty.Id)}
                                style={{ background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)" }}
                              >
                                <div className="tree-header-content">
                                  <svg
                                    className={`tree-icon ${isFacultyExpanded ? "expanded" : ""}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                  <div className="tree-info">
                                    <div className="tree-title">{faculty.Name}</div>
                                    {faculty.Description && (
                                      <div className="tree-description">{faculty.Description}</div>
                                    )}
                                  </div>
                                </div>
                                <div className="tree-badge">{faculty.Courses.length} kurzus</div>
                              </div>

                              <div className={`tree-content ${isFacultyExpanded ? "expanded" : ""}`}>
                                <div className="tree-children">
                                  {faculty.Courses.length === 0 ? (
                                    <div className="course-item">
                                      <div className="course-info">
                                        <div className="course-name">Nem található kurzus</div>
                                        <div className="course-description">
                                          Ehhez a karhoz még nincsenek hozzárendelve kurzusok.
                                        </div>
                                      </div>
                                    </div>
                                  ) : (
                                    faculty.Courses.map((course) => (
                                      <div
                                        key={course.Id}
                                        className="course-item"
                                        onClick={() => handleCourseClick(course.Id, course.Name)}
                                      >
                                        <div className="course-info">
                                          <div className="course-name">{course.Name}</div>
                                          {course.Description && (
                                            <div className="course-description">{course.Description}</div>
                                          )}
                                        </div>
                                        <svg
                                          className="course-arrow"
                                          width="20"
                                          height="20"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                          />
                                        </svg>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Courses;
