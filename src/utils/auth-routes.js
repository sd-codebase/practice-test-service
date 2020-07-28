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
};

const dashboardUrl = `/${API}/${ROUTES.Dashboard}/`;
const testsUrl = `/${API}/${ROUTES.Test}/`;
const questionsUrl = `/${API}/${ROUTES.Question}/`;
const usersUrl = `/${API}/${ROUTES.User}/`;
const chaptersUrl = `/${API}/${ROUTES.Chapter}/`;
const notesUrl = `/${API}/${ROUTES.Note}/`;

export const authRoutes = [
    dashboardUrl, testsUrl, questionsUrl,
    chaptersUrl, notesUrl
];