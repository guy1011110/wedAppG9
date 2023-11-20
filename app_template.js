const express = require("express");
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use("/public", express.static('/Users/phakornc/Desktop/web appppp/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(session({
     cookie: { maxAge: 24*60*60*1000 }, //1 day in millisec
     secret: 'mysecretcode',
     resave: false,
    saveUninitialized: true
 }));
const con = mysql.createConnection({
    host: 'localhost', 
    user: 'root',
    password: '',
    database: 'Pro'
});


const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Pro',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

con.connect((err) => {
    if (err) {
        console.error("Error connecting to MySQL: " + err.stack);
        return;
    }
    console.log("Connected to MySQL as id " + con.threadId);
});


app.post("/login", async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const sql = "SELECT userid, username, password, fullname, role FROM user WHERE username = ?";
    con.query(sql, [username], async function (err, results) {
        if (err) {
            return res.status(500).send("Database error!!");
        } 
        if (results.length !== 1) {
            return res.status(401).send("Wrong username or password!!");
        }

        const user = results[0];
        const match = await bcrypt.compare(password, user.password);

        if (match) {
            req.session.username = username;                
             req.session.fullname = fullname;
            req.session = {
                id: user.userid,
                username: user.username,
                role: user.role,
                fullname: user.fullname
            };
            res.json({ 
                success: true,
                username: user.username, 
                userid: user.userid,
                role: user.role
            });
        } else {
            res.status(401).send("Wrong username or password!!");
        }
    });
});




app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const sql = "SELECT userid, username, role FROM user WHERE username = ? AND password = ?";

    con.query(sql, [username, password], function (err, results) {
        if (err) {
            res.status(500).send("Database error!!");
        } else if (results.length !== 1) {
            res.status(401).send("Wrong username or password!!");
        } else {
            const user = results[0];
            res.json({ 
                success: true,
                username: user.username, 
                userid: user.userid 
            });
        }
    });
});




app.post("/userRole", function (req, res) {
    const username = req.body.username;
    if (!username) {
        res.status(400).send("Username is required");
        return;
    }

    const sql = "SELECT role FROM user WHERE username = ?";
    con.query(sql, [username], function (err, results) {
        if (err) {
            res.status(500).send("Database error!!");
        } else if (results.length !== 1) {
            res.status(401).send("Wrong username or user not found!!");
        } else {
            const userRole = results[0].role;

            if (userRole === 1) {
                res.json({ role: "student" });
            } else if (userRole === 2) {
                res.json({ role: "staff" });
            } else if (userRole === 3) {
                res.json({ role: "lecturer" });
            } else {
                res.status(403).send("Invalid role");
            }
        }
    });
});

app.get("/", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/login regis/login.html"));
});
app.get("/register", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/login regis/register.html"));
});

app.get("/login-page", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/login regis/login.html"));
});

app.get("/student", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/student/std-asset.html"));
});

app.get("/staff", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/student/test.html"));
});

app.get("/lecturer", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/lect/lec-borr-req.html"));
});

app.get("/setting", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/student/std-setting.html"));
});


// register======

// Add this code to your existing project.js file:

app.post("/register", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const role = req.body.role;

    if (!username || !password || !role) {
        res.status(400).send("All fields are required!");
        return;
    }

    const sqlCheck = "SELECT userid FROM user WHERE username = ?";
    con.query(sqlCheck, [username], function (err, results) {
        if (err) {
            res.status(500).send("Database error!!");
        } else if (results.length > 0) {
            res.status(400).send("Username already exists!!");
        } else {
            const sqlInsert = "INSERT INTO user (username, password, role) VALUES (?, ?, ?)";
            con.query(sqlInsert, [username, password, role], function (err) {
                if (err) {
                    res.status(500).send("Database error during registration!!");
                } else {
                    res.status(200).send("Successfully registered!");
                }
            });
        }
    });
});

// Route to serve the register page:


// Get all assets
app.get("/assets", function (req, res) {
    const sql = "SELECT * FROM Asset"; // Assuming your table name is Asset
    con.query(sql, function (err, results) {
        if (err) {
            res.status(500).send("Database error!!");
        } else {
            res.json(results);
        }
    });
});





// Add a new asset


// Add a new asset
app.post("/assets", function(req, res) {
    const { Assetname, Assetimg, Assetstatus, Staffaddid } = req.body;

    const sqlInsert = "INSERT INTO Asset (Assetname, Assetimg, Assetstatus, Staffaddid ) VALUES (?, ?, ?, ?)";
    con.query(sqlInsert, [Assetname, Assetimg, Assetstatus, Staffaddid], function(err, result) {
        if (err) {
            res.status(500).send("Database error during the insertion!!");
        } else {
            res.status(201).json({ success: true, message: 'Asset added successfully', insertId: result.insertId });
        }
    });
});

// Edit an existing asset
app.put("/assets/:id", function(req, res) {
    const { Assetname, Assetimg, Assetstatus, Staffaddid } = req.body;
    const id = req.params.id;

    const sqlUpdate = "UPDATE Asset SET Assetname = ?, Assetimg = ?, Assetstatus = ?, Staffaddid = ? WHERE Assetid = ?";
    con.query(sqlUpdate, [Assetname, Assetimg, Assetstatus, Staffaddid, id], function(err, result) {
        if (err) {
            res.status(500).send("Database error during the update!!");
        } else {
            if (result.affectedRows === 0) {
                res.status(404).send("No asset found with given ID!!");
            } else {
                res.status(200).json({ success: true, message: 'Asset updated successfully' });
            }
        }
    });
});

// Delete an asset
app.delete("/assets/:id", function(req, res) {
    const id = req.params.id;

    const sqlDelete = "DELETE FROM Asset WHERE Assetid = ?";
    con.query(sqlDelete, [id], function(err, result) {
        if (err) {
            res.status(500).send("Database error during the deletion!!");
        } else {
            if (result.affectedRows === 0) {
                res.status(404).send("No asset found with given ID!!");
            } else {
                res.status(200).json({ success: true, message: 'Asset deleted successfully' });
            }
        }
    });
});
app.get("/test", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/student/test.html"));
});
app.get("/student/asset-accept", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/student/std-asset accept.html"));
});
app.get("/lect/getreturn", function (_req, res) {
    res.sendFile(path.join(__dirname, "/public/web_pro/lect/lect-return.html"));
});


// This is just a sample code, you will need to adapt it to your actual backend setup.

app.post('/borrow-asset', (req, res) => {
    const { assetId, borrowDate, returnDate, username } = req.body; // Include username in the destructured object

    // Example query, make sure to validate and sanitize input to prevent SQL injection
    const sqlInsert = `INSERT INTO BorrowReq (AssetId, BorrowDate, ReturnDate, Status, Borrowname) VALUES (?, ?, ?, 'Pending', ?)`; // Include Borrowname in the SQL query

    // Perform the SQL query with the provided parameters
    con.query(sqlInsert, [assetId, borrowDate, returnDate, username], (err, result) => { // Include username in the parameters array
        if (err) {
            // Handle error
            console.error(err);
            res.status(500).json({ success: false, message: 'Database insertion failed' });
        } else {
            // Handle success
            res.status(201).json({ success: true, message: 'Borrow request saved', data: result });
        }
    });
});





app.put('/update-asset-status/:assetId', (req, res) => {
    const assetId = req.params.assetId;
    const { status } = req.body;

    const query = 'UPDATE Asset SET Assetstatus = ? WHERE Assetid = ?';
    con.query(query, [status, assetId], (error, results) => {
        if (error) {
            res.status(500).send("Database error: " + error.message);
        } else if (results.affectedRows === 0) {
            res.status(404).send("Asset not found or no change in status");
        } else {
            res.status(200).json({ success: true, message: `Asset status updated to ${status}` });
        }
    });
});

app.put('/update-asset-status/:assetId', (req, res) => {
    const assetId = req.params.assetId;
    const { status } = req.body;
  
    // SQL query to update the status of the asset
    const query = 'UPDATE Asset SET Assetstatus = ? WHERE Assetid = ?';
  
    con.query(query, [status, assetId], (error, results) => {
        if (error) {
            res.status(500).send("Database error: " + error.message);
        } else if (results.affectedRows === 0) {
            res.status(404).send("Asset not found or no change in status");
        } else {
            res.status(200).json({ status: 'success', message: `Asset status updated to ${status}` });
        }
    });
});


  
app.get("/borrow-assett", function (req, res) {
    // Adjust the SQL query to match your table and column names exactly.
    const sql = `
    SELECT br.Reqid, br.Borrowname, br.Borrowdate, br.ReturnDate, br.Status, a.Assetname
    FROM BorrowReq br
    INNER JOIN Asset a ON br.Assetid = a.Assetid
    WHERE br.Status = 'Pending'
    `;
    


    con.query(sql, function (err, results) {
        console.log(results); // Add this line to log the results
        if (err) {
            res.status(500).send("Database error!!");
        } else {
            res.json(results);
        }
    });
    
});



// ... rest of your server code

app.post('/approve-request', (req, res) => {
    const { requestId, username } = req.body;

    const sqlApprove = 'UPDATE BorrowReq SET lectname = ?, Status = "Approved" WHERE Reqid = ?';
    
    pool.query(sqlApprove, [username, requestId], (error, approveResult) => {
        if (error) {
            return res.status(500).json({ message: 'Error on the server.', error: error.message });
        }
        
        if (approveResult.affectedRows) {
            const sqlUpdateAsset = 'UPDATE Asset JOIN BorrowReq ON Asset.Assetid = BorrowReq.Assetid SET Asset.Assetstatus = "Borrowing" WHERE BorrowReq.Reqid = ?';
            
            pool.query(sqlUpdateAsset, [requestId], (error, updateAssetResult) => {
                if (error) {
                    return res.status(500).json({ message: 'Error on the server.', error: error.message });
                }

                if (updateAssetResult.affectedRows) {
                    res.json({ message: 'Request approved and asset status updated successfully.' });
                } else {
                    res.status(404).json({ message: 'Asset not found.' });
                }
            });
        } else {
            res.status(404).json({ message: 'Request not found.' });
        }
    });
});

app.post('/disapprove-request', (req, res) => {
    const { requestId, username, reason } = req.body;

    const sqlDisapprove = 'UPDATE BorrowReq SET lectname = ?, Comment = ?, Status = "Disapproved" WHERE Reqid = ?';
    
    pool.query(sqlDisapprove, [username, reason, requestId], (error, disapproveResult) => {
        if (error) {
            return res.status(500).json({ message: 'Error on the server.', error: error.message });
        }
        
        if (disapproveResult.affectedRows) {
            const sqlUpdateAsset = 'UPDATE Asset JOIN BorrowReq ON Asset.Assetid = BorrowReq.Assetid SET Asset.Assetstatus = "Disabled" WHERE BorrowReq.Reqid = ?';
            
            pool.query(sqlUpdateAsset, [requestId], (error, updateAssetResult) => {
                if (error) {
                    return res.status(500).json({ message: 'Error on the server.', error: error.message });
                }

                if (updateAssetResult.affectedRows) {
                    res.json({ message: 'Request disapproved and asset status updated successfully.' });
                } else {
                    res.status(404).json({ message: 'Asset not found.' });
                }
            });
        } else {
            res.status(404).json({ message: 'Request not found.' });
        }
    });
});

app.get('/asset-borrow-requests', async (req, res) => {
    const sql = `
      SELECT 
        Asset.Assetid, Asset.Assetimg, Asset.Assetname, Asset.Assetstatus, Asset.Staffaddid,
        BorrowReq.Borrowdate, BorrowReq.ReturnDate, BorrowReq.lectname
      FROM Asset
      LEFT JOIN BorrowReq ON Asset.Assetid = BorrowReq.Assetid
    `;
  
    try {
      const [results] = await con.promise().query(sql);
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).send("Database error.");
    }
  });
  

  app.put('/return-asset/:assetId', async (req, res) => {
    const assetId = req.params.assetId;
    const { newStatus } = req.body;
    
    console.log(`Attempting to return asset with ID: ${assetId}`);
    
    try {
      await con.promise().beginTransaction();
      
      // Update Asset table
      const [assetUpdateResult] = await con.promise().query('UPDATE Asset SET Assetstatus = ? WHERE Assetid = ?', [newStatus, assetId]);
      
      if (assetUpdateResult.affectedRows === 0) {
        throw new Error('Asset not found');
      }
      
      // Update BorrowReq table
      // This assumes that there is only one active borrow request per asset at a time
      const [borrowUpdateResult] = await con.promise().query('UPDATE BorrowReq SET Status = ? WHERE Assetid = ? AND Status != "Returned"', [newStatus, assetId]);
      
      if (borrowUpdateResult.affectedRows === 0) {
        throw new Error('Borrow request not found or already returned');
      }
      
      await con.promise().commit();
      res.json({ success: true, message: 'Asset returned successfully' });
    } catch (error) {
      console.error('Error during the return asset transaction:', error);
      await con.promise().rollback();
      res.status(500).json({ success: false, message: 'Transaction failed: ' + error.message });
    }
  });
  
//   app.get('/search-assets', async (req, res) => {
//     const { name } = req.query;
//     try {
//       const [results] = await con.promise().query('SELECT * FROM Asset WHERE Assetname LIKE ?', [`%${name}%`]);
//       res.json(results);
//     } catch (error) {
//       console.error(error);
//       res.status(500).send("Database error.");
//     }
//   });
  app.get('/disabled-assets-requests', (req, res) => {
    const sql = `
        SELECT a.*, br.comment
        FROM Asset a
        LEFT JOIN BorrowReq br ON a.Assetid = br.Assetid
        WHERE a.Assetstatus = 'Disabled'
    `;
  
    con.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});

  
  
app.get('/pending-assets-requests', async (req, res) => {
    const sql = `
      SELECT *
      FROM Asset
      WHERE Assetstatus = 'Pending'
    `;
  
    try {
      const [results] = await con.promise().query(sql);
      res.json(results);
    } catch (error) {
      res.status(500).send("Database error.");
    }
  });
  
  
  
  app.get('/asset-borrow-return', async (req, res) => {
    const sql = `
      SELECT 
        Asset.Assetid, Asset.Assetimg, Asset.Assetname, Asset.Assetstatus, Asset.Staffaddid,
        BorrowReq.Borrowdate, BorrowReq.ReturnDate, BorrowReq.lectname
      FROM Asset
      LEFT JOIN BorrowReq ON Asset.Assetid = BorrowReq.Assetid
    `;
  
    try {
      const [results] = await con.promise().query(sql);
      res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).send("Database error.");
    }
  });
  app.delete('/getreturn-asset/:assetId', async (req, res) => {
    const assetId = req.params.assetId;
    
    try {
      await con.promise().beginTransaction();
      
      // Update Asset table to set Assetstatus to 'Available'
      const updateAssetStatusQuery = 'UPDATE Asset SET Assetstatus = "Available" WHERE Assetid = ?';
      const [assetUpdateResult] = await con.promise().query(updateAssetStatusQuery, [assetId]);
      
      if (assetUpdateResult.affectedRows === 0) {
        throw new Error('Asset not found');
      }
      
      // Delete the row from BorrowReq table
      const deleteBorrowReqQuery = 'DELETE FROM BorrowReq WHERE Assetid = ?';
      const [borrowReqDeleteResult] = await con.promise().query(deleteBorrowReqQuery, [assetId]);
      
      // Check if the delete operation was successful
      if (borrowReqDeleteResult.affectedRows === 0) {
        throw new Error('Borrow request not found or already handled');
      }
      
      await con.promise().commit();
      res.json({ success: true, message: 'Asset returned and borrow request deleted' });
    } catch (error) {
      await con.promise().rollback();
      res.status(500).json({ success: false, message: 'Transaction failed: ' + error.message });
    }
});

  
const port = 3000;
app.listen(port, function () {
    console.log("Server is ready at " + port);
});