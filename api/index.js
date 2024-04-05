/*const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User=require('./models/User');
const bcrypt=require('bcryptjs');  //used for encrypting password
const app= express();
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const multer=require('multer');   //used for uploading 
const uploadMiddleware=multer({dest:'uploads/' });
const fs=require('fs');
const Post = require('./models/Post');


const salt=bcrypt.genSaltSync(10);
const secret='23werdfo87654fghj09876';


app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://greezdh:DPk4dMiP7cu6FJf7@cluster0.2uzrlcj.mongodb.net/?retryWrites=true&w=majority')

app.post('/register',async (req,res)=>{  //async and await are used to make function return a promise
  const {username,password}=req.body;
  try{
    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),  // adds salt sync to the password
    });
    res.json(userDoc);

}catch(e){
  console.log(e);
  res.status(400).json(e);
  }
});

app.post('/login',async (req,res)=>{
  const {username,password}=req.body;
  const userDoc = await User.findOne({username})   
  const passOk=bcrypt.compareSync(password,userDoc.password)  //returns true if the request password matches
  if(passOk){
    //logged in 
    jwt.sign({username,id:userDoc._id},secret,{},(err,token)=>{
      if (err) throw err;
      res.cookie('token',token).json({
        id:userDoc._id,
        username,
      });
    });
  }
  else{
    res.status(400).json("password failed");
  }
});

app.get('/profile',(req,res)=>{
  const {token}=req.cookies;  //can read-only cookie in backend as its made secret
   
  jwt.verify(token,secret,{},(err,info)=>{
    if(err) throw err;
    res.json(info);
  })
  res.json(req.cookies);
})

app.post('/logout',(req,res)=>{
  res.cookie('token',"").json('ok');
});

app.post('/post',uploadMiddleware.single('file'),async (req,res)=>{
  const {originalname,path}=req.file;
  const parts = originalname.split('.');
  const ext=parts[parts.length-1] //getting last word of files name
  const newPath=path+'.'+ext;
  fs.renameSync(path,newPath);//renaming the file name


  const {token}=req.cookies;
  jwt.verify(token,secret,{},async(err,info)=>{
    if(err) throw err;
    const {title,summary,content}=req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author:info.id,
  }) 
  res.json({postDoc});
});
});


  

app.get('/post', async(req, res) => {
  res.json(
  await Post.find()
  .populate('author')
  .sort({createdAt: -1}) //gives recent post on the top
  .limit(20) //20 post on page 
  );   //gets only username of author
});


app.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})

app.listen(8080);
*/

/*const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://thrishal731:toiSNltVBswzDEkB@cluster0.kkktti7.mongodb.net/?retryWrites=true&w=majority');

app.post('/register', async (req,res) => {
  const {username,password} = req.body;
  try{
    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),
    });
    res.json(userDoc);
  } catch(e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/login', async (req,res) => {
  const {username,password} = req.body;
  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});

app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) throw err;
    res.json(info);
  });
});

app.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
  const {originalname,path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path+'.'+ext;
  fs.renameSync(path, newPath);

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {title,summary,content} = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author:info.id,
    });
    res.json(postDoc);
  });

});

/*app.post('/post',uploadMiddleware.single('file'), async (req,res) => {
  let newPath = null;
  if (req.file) {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  }

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {id,title,summary,content} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('please edit with correct credentials');
    }
    await postDoc.update();
    ({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });

});*/

// Set up multer storage
/*const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, ext) + '-' + Date.now() + ext;
    cb(null, fileName);
  },
});*/

// Set up multer middleware
//const uploadMiddleware = multer({ storage: storage });

/*app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  try {
    let newPath = '';

    if (req.file) {
      const { path } = req.file;
      const ext = path.extname(req.file.filename);
      newPath = path + '-' + Date.now() + ext;
      fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    const info = jwt.verify(token, secret);

    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);

    if (!postDoc || postDoc.author.toString() !== info.id) {
      return res.status(400).json('You are not the author or post not found.');
    }

    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    postDoc.cover = newPath || postDoc.cover;

    await postDoc.save();

    res.json(postDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});

app.get('/post', async (req,res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})


app.post('/post/:id/like', async (req, res) => {
  const postId = req.params.id;

  try {
    const postDoc = await Post.findById(postId);

    if (postDoc) {
      postDoc.likes += 1; // Increment likes for the post
      await postDoc.save(); // Save the updated post document

      res.json({ likes: postDoc.likes });
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating post likes" });
  }
});*/


/*app.post('/post/:id/like', async (req, res) => {
  const postId = req.params.id;
  try {
    const postDoc = await Post.findById(postId);
    if (postDoc) {
      postDoc.likes += 1; // Increment likes for the post
      await postDoc.save(); // Save the updated post document

      res.json({ likes: postDoc.likes });
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating post likes" });
  }
});*/


//app.listen(4000);

/*const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User=require('./models/User');
const bcrypt=require('bcryptjs');  //used for encrypting password
const app= express();
const jwt=require('jsonwebtoken');
const cookieParser=require('cookie-parser');
const multer=require('multer');   //used for uploading 
const uploadMiddleware=multer({dest:'uploads/' });
const fs=require('fs');
const Post = require('./models/Post');


const salt=bcrypt.genSaltSync(10);
const secret='23werdfo87654fghj09876';


app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads',express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://greezdh:DPk4dMiP7cu6FJf7@cluster0.2uzrlcj.mongodb.net/?retryWrites=true&w=majority')

app.post('/register',async (req,res)=>{  //async and await are used to make function return a promise
  const {username,password}=req.body;
  try{
    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),  // adds salt sync to the password
    });
    res.json(userDoc);

}catch(e){
  console.log(e);
  res.status(400).json(e);
  }
});

app.post('/login',async (req,res)=>{
  const {username,password}=req.body;
  const userDoc = await User.findOne({username})   
  const passOk=bcrypt.compareSync(password,userDoc.password)  //returns true if the request password matches
  if(passOk){
    //logged in 
    jwt.sign({username,id:userDoc._id},secret,{},(err,token)=>{
      if (err) throw err;
      res.cookie('token',token).json({
        id:userDoc._id,
        username,
      });
    });
  }
  else{
    res.status(400).json("password failed");
  }
});

app.get('/profile',(req,res)=>{
  const {token}=req.cookies;  //can read-only cookie in backend as its made secret
   
  jwt.verify(token,secret,{},(err,info)=>{
    if(err) throw err;
    res.json(info);
  })
  res.json(req.cookies);
})

app.post('/logout',(req,res)=>{
  res.cookie('token',"").json('ok');
});

app.post('/post',uploadMiddleware.single('file'),async (req,res)=>{
  const {originalname,path}=req.file;
  const parts = originalname.split('.');
  const ext=parts[parts.length-1] //getting last word of files name
  const newPath=path+'.'+ext;
  fs.renameSync(path,newPath);//renaming the file name


  const {token}=req.cookies;
  jwt.verify(token,secret,{},async(err,info)=>{
    if(err) throw err;
    const {title,summary,content}=req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author:info.id,
  }) 
  res.json({postDoc});
});
});


  

app.get('/post', async(req, res) => {
  res.json(
  await Post.find()
  .populate('author')
  .sort({createdAt: -1}) //gives recent post on the top
  .limit(20) //20 post on page 
  );   //gets only username of author
});


app.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})

app.listen(8080);
*/

const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const User = require('./models/User');
const Post = require('./models/Post');
const bcrypt = require('bcryptjs');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

const salt = bcrypt.genSaltSync(10);
const secret = 'asdfe45we45w345wegw345werjktjwertkj';

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

mongoose.connect('mongodb+srv://thrishal731:toiSNltVBswzDEkB@cluster0.kkktti7.mongodb.net/?retryWrites=true&w=majority');

//register
app.post('/register', async (req,res) => {
  const {username,password} = req.body;
  try{
    const userDoc = await User.create({
      username,
      password:bcrypt.hashSync(password,salt),
    });
    res.json(userDoc);
  } catch(e) {
    console.log(e);
    res.status(400).json(e);
  }
});

//login
app.post('/login', async (req,res) => {
  const {username,password} = req.body;
  const userDoc = await User.findOne({username});
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        id:userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('wrong credentials');
  }
});

//front page
app.get('/profile', (req,res) => {
  const {token} = req.cookies;
  jwt.verify(token, secret, {}, (err,info) => {
    if (err) throw err;
    res.json(info);
  });
});

//logout
app.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});

//new post
app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
  const {originalname,path} = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path+'.'+ext;
  fs.renameSync(path, newPath);

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {title,summary,content} = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover:newPath,
      author:info.id,
    });
    res.json(postDoc);
  });

});

/*app.post('/post',uploadMiddleware.single('file'), async (req,res) => {
  let newPath = null;
  if (req.file) {
    const {originalname,path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path+'.'+ext;
    fs.renameSync(path, newPath);
  }

  const {token} = req.cookies;
  jwt.verify(token, secret, {}, async (err,info) => {
    if (err) throw err;
    const {id,title,summary,content} = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json('please edit with correct credentials');
    }
    await postDoc.update();
    ({
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    });

    res.json(postDoc);
  });

});*/

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination folder for uploaded files
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, ext) + '-' + Date.now() + ext;
    cb(null, fileName);
  },
});

// Set up multer middleware
//const uploadMiddleware = multer({ storage: storage });


//editing post
app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  try {
    let newPath = '';

    if (req.file) {
      const { path } = req.file;
      const ext = path.extname(req.file.filename);
      newPath = path + '-' + Date.now() + ext;
      fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    const info = jwt.verify(token, secret);

    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);

    if (!postDoc || postDoc.author.toString() !== info.id) {
      return res.status(400).json('You are not the author or post not found.');
    }

    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    postDoc.cover = newPath || postDoc.cover;

    await postDoc.save();

    res.json(postDoc);
  } catch (error) {
    console.error(error);
    res.status(500).json('Internal Server Error');
  }
});


//only 20 posts seen in front page
app.get('/post', async (req,res) => {
  res.json(
    await Post.find()
      .populate('author', ['username'])
      .sort({createdAt: -1})
      .limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  const {id} = req.params;
  const postDoc = await Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})





/*app.post('/post/:id/like', async (req, res) => {
  const postId = req.params.id;
  try {
    const postDoc = await Post.findById(postId);
    if (postDoc) {
      postDoc.likes += 1; // Increment likes for the post
      await postDoc.save(); // Save the updated post document

      res.json({ likes: postDoc.likes });
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating post likes" });
  }
});*/


app.listen(4000);