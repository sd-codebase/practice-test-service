const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
const DELETE = 'DELETE';

export const API = 'api';

export const ROUTES = {
    Dashboard: 'dashboard',
    Test: 'tests',
    Question: 'questions',
    User: 'users',
    Chapter: 'chapters',
    Note: 'notes',
    MockTest: 'mock-tests',
    Scripts: 'scripts',
};

const dashboardUrl = `/${API}/${ROUTES.Dashboard}/`;
const testsUrl = `/${API}/${ROUTES.Test}/`;
const questionsUrl = `/${API}/${ROUTES.Question}/`;
const usersUrl = `/${API}/${ROUTES.User}/`;
const scriptsUrl = `/${API}/${ROUTES.Scripts}/`;
const chaptersUrl = `/${API}/${ROUTES.Chapter}/`;
const notesUrl = `/${API}/${ROUTES.Note}/`;
const mockTestsUrl = `/${API}/${ROUTES.MockTest}/`;

export const authRoutes = [
    dashboardUrl, testsUrl, questionsUrl,
    chaptersUrl, notesUrl, mockTestsUrl,
    scriptsUrl,
];