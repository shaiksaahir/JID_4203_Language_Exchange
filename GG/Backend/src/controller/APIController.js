import { pool } from '../config/connectDB'; //TOWNSHEND: this was formally connected to sequelize...
//but the methods were using .execute method, so I changed the import to the pool object

//TOWNSHEND: getAllUsers may be the best way to sort users on a page since all data on a UserAccount is attached to the user
// I can explore this more
let getAllUsers = async (req, res) => {
    try {
        const { name } = req.query; // Get the username from query parameters
    
        // Check if the username is provided
        if (!name) {
          return res.status(400).json({ message: 'Username query parameter is missing' });
        }
    
        // Use parameterized query to prevent SQL injection
        const [users] = await pool.execute(`SELECT firstName FROM UserAccount WHERE firstName = ?`, [name]);
    
        return res.status(200).json({
          message: 'ok',
          data: users
        });
      } catch (error) {
        console.error('Error retrieving users:', error);
        return res.status(500).json({
          message: 'Error retrieving users',
          error: error.message
        });
      }
};




let createNewUser = async (req, res) => { //POST function
    let { firstName, lastName, email, address } = req.body;
    if (!firstName || !lastName || !email || !address) {
        return res.status(200).json({
            message: 'missing @params'
        })
    }
    await pool.execute('insert into UserAccount(firstName, lastName, email, address) values(?, ?, ?, ?)', [firstName, lastName, email, address]);
    return res.status(200).json({
        message: 'ok'
    })
}

let updateUser = async (req, res) => { // PUT function
    let { firstName, lastName, email, address, id } = req.body;
    if (!firstName || !lastName || !email || !address || !id) {
        return res.status(200).json({
            message: 'missing @params'
        })
    }

    await pool.execute('update UserAccount set firstName = ?, lastName= ?, email = ?, address= ? WHERE id = ?',
        [firstName, lastName, email, address, id]);
    return res.status(200).json({
        message: 'ok'
    })
    
}

let deleteUser = async (req, res) => { // DELETE function
     let userId = req.params.id;
     if (!userId) { 
        return res.status(200).json({
            message: 'missing @params'
        })
    }

    await pool.execute('delete from UserAccount where id = ?', [userId])
      return res.status(200).json({
        message: 'ok'
    })
}

//TOWNSHEND: I created a simpler function that isolated the user firstName and lastName
// but may not be good for sorting.
const getUserNames = async (req, res) => {
    try {
        const [users] = await pool.execute(`SELECT firstName, lastName FROM UserAccount`);
        res.status(200).json({
        message: 'ok',
        data: users
      });
    } catch (error) {
      console.error('Error retrieving user names:', error); // Log error details
      res.status(500).json({
        message: 'Error retrieving user names',
        error: error.message
      });
    }
};

module.exports = { 
    getAllUsers, createNewUser, updateUser, deleteUser, getUserNames, // added getUserNames as an export
}