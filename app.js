import express from 'express';
import fs from 'fs';

const app = express(); 

app.use(express.json())
// create a endpoint that fetch all users 
app.get('/', (req,res) =>{
    fs.readFile('./users.json', 'utf-8', (err,data) =>{
     if(err){
         return res.status(500).send('something went wrong')
     }
      const avalableUser = JSON.parse(data)
 
      res.send(avalableUser)
 
    })
 })
//create a end point that fetch a specific user 
app.get('/user/:id', (req,res) =>{
        const {id} = req.params 
    fs.readFile('./users.json','utf-8',(err,data)=>{
        if(err){
            return res.status(500).send('Sorry, something went wrong.')
        }

        const users = JSON.parse(data);
        let currentUser = [];
        let foundUser = false;
       // console.log(users)
      users.forEach(element => {
            if(element.id == id){
                foundUser = true
              currentUser = element
              return;
            }
        });

      if(foundUser){
        res.send(currentUser)
      }else{
        res.send('no such user')
      }
              
    })
  
})

// create a endpoint that create user 

app.post('/register', (req, res) =>{
    const {username,password,email} = req.body ;

    let usercreatedstatus = '';

    fs.readFile('./users.json','utf-8',(err,data)=>{
        if(err){
            return res.status(500).send('something went wrong.')
        }

        const avalableUser = JSON.parse(data)  

        const lastUserId = avalableUser[avalableUser.length-1].id
        avalableUser.push({
            id : lastUserId + 1 ,
            username: username ,
            password: password,
            email: email 
        })
        
       fs.writeFile('./users.json', JSON.stringify(avalableUser) ,() =>{

           
        return  res.status(201).send({"status" : "ok"})
       } )
      
    })

   
})

//create a endpoint that validate users 

app.post('/login' , (req,res) =>{
      const {username, password} = req.body

  fs.readFile('./users.json' , 'utf-8' , (err , data) =>{
        if(err){
          return res.status(500).send('something went wrong.')
      }

      const allUser = JSON.parse(data) ;
      let ValidUserStatus = false ;
      let validUser = [] ;

       allUser.forEach(user =>{
        if(user.username == username && user.password == password){
              ValidUserStatus = true
              validUser = user
        }
       })
       if(ValidUserStatus){
          const  validUserDetails = {
              id: validUser.id,
              username : validUser.username,
              email : validUser.email
            };
          res.status(201).send(validUserDetails) ;
       }else{
          res.status(401).send('invalid user')
       }
      // console.log(validUser)


  })
})

app.listen(4900, () =>{
    console.log('app is running on port 4900' )
})