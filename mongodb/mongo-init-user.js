db.auth('admin-user', 'admin-password');

db = db.getSiblingDB('tourismeDB');

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
