import {CountModel as Count} from './dashboard.model';

function getCounts (req, res) {
    Count.find({}, function (err, count) {
        if (err) return next(err);
        res.send(count);
    })
};

export { getCounts };