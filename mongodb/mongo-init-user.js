db.auth('admin-user', 'admin-password');

db = db.getSiblingDB('assignmentDB');

db.createUser({
    user: 'tilt',
    pwd: 'tilt',
    roles: [    
        {
            role: 'root',
            db: 'admin',
        },
    ],
});
