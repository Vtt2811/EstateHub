import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import jwt from 'jsonwebtoken';
export const register = async (req, res) => {
    const {username, email, password} = req.body;

    try{
    // HASH THE PASSWORD
    const  hashedPassword = await bcrypt.hash(password, 10);

    console.log(hashedPassword);

    // CREATE A NEW USER AND SAVE IT TO DATABASE
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword
        }
    });
    console.log(username,password,email);
    console.log(newUser);
    
    res.status(201).json({message: "User created successfully"});

}catch(error){
    console.log("Register error:", error);
    res.status(500).json({message: "Failed to create user"});
}
}



export const login = async (req, res) => {
    const {username,password} = req.body;

    try{
        //CHECK IF THE USER EXISTS OR NOT

        const user = await prisma.user.findUnique({
            where:{username}
        });

        if(!user){
            //401 UNAUTHORIZED
            return res.status(401).json({message: "Invalid Credentials"});
        }
        
        //CHECK USER PASSWORD IS CORRECT OR NOT

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).json({message: "Invalid Credentials"});
        }

        
        //GENERATE A COOKIE TOKEN AND SEND IT TO THE USER

      
        // res.setHeader("Set-Cookie", "test=" + "myValue").json({message: "Logged in successfully"});
        const age = 1000 * 60 * 60 * 24 * 7; //1 week

        const token = jwt.sign({
            id: user.id,
            //want to add admin property to the token in future
            isAdmin: false,
        },process.env.JWT_SECRET_KEY,{expiresIn:age})

        //transfeer user data directly
        const {password:userPassword, ...userInfo} = user;

        res.cookie("token",token,{
            httpOnly: true,
            maxAge: age, 
            // secure:true,
        }).status(200).json(userInfo);


        
    }catch(error){
        console.log(error)
        res.status(500).json({message: "Failed to login"});
    }
}

export const logout =   (req, res) => {

    res.clearCookie("token").status(200).json({message: "Logged out successfully"});
}
    
    