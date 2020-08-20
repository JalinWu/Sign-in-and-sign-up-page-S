const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const file = "./account.db";
const sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      db.serialize(() => {
        // Match user
        const sqlFindEmail = `SELECT * FROM User WHERE email = ?`;
  
        db.all(sqlFindEmail, email, (err, row) => {
          
          if (row.length == 0) {
            return done(null, false, { message: 'That email is not registered' });
          }
  
          // Match password
          bcrypt.compare(password, row[0].password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, row[0]);
            } else {
              return done(null, false, { message: 'Password incorrect' });
            }
          });
  
        });
      
      })
    })
  );

  passport.serializeUser(function (user, done) {
    done(null, user.email);
  });

  passport.deserializeUser(function (email, done) {
    db.serialize(() => {
      const sqlFindId = `SELECT * FROM User WHERE email = ?`;
  
      db.all(sqlFindId, email, (err, row) => {
        done(err, row[0]);
      });
    
    })
  });
};
