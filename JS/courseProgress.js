const COURSES = ['course1', 'course2', 'course3', 'course4'];

function initializeCourseProgress() {
    if (!localStorage.getItem('courseProgress')) {
        const initialProgress = COURSES.reduce((acc, course) => {
            acc[course] = false;
            return acc;
        }, {});
        localStorage.setItem('courseProgress', JSON.stringify(initialProgress));
    }
}

function markCourseAsCompleted(courseId) {
    const progress = JSON.parse(localStorage.getItem('courseProgress'));
    progress[courseId] = true;
    localStorage.setItem('courseProgress', JSON.stringify(progress));
}

function isCourseCompleted(courseId) {
    const progress = JSON.parse(localStorage.getItem('courseProgress'));
    return progress[courseId];
}

function getNextIncompleteCoursePage() {
    const progress = JSON.parse(localStorage.getItem('courseProgress'));
    for (let i = 0; i < COURSES.length; i++) {
        if (!progress[COURSES[i]]) {
            return `course${i + 1}.html`;
        }
    }
    return null; // All courses completed
}

function areAllCoursesCompleted() {
    const progress = JSON.parse(localStorage.getItem('courseProgress'));
    return COURSES.every(course => progress[course]);
}

initializeCourseProgress();