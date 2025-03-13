const express = require("express");
const userModel = require("../models/user");
const productModel = require("../models/product");
const bodyparser = require('body-parser')
const session = require('express-session');
const ejs = require('ejs');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
var moment = require('moment');
const qr = require('qrcode');
const multer = require('multer');
const fs = require('fs');
const path = require('path')
const upload = require('express-fileupload')
const busboy = require('connect-busboy');
const Product = require("../models/product");

// for getting ip
const os = require('os');
const systemIP = getSystemIP();
function getSystemIP() {
    const networkInterfaces = os.networkInterfaces();
    for (let name of Object.keys(networkInterfaces)) {
        for (let net of networkInterfaces[name]) {
            if (net.family === 'IPv4' &&!net.internal) {
                return net.address;
            }
        }
    }
    throw new Error('Unable to determine system IP address.');
}

const app = express();


app.use(express.static("public"));

app.set("view engine", 'ejs');
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(busboy());
app.use(upload());



app.use(session({
    secret: "thesecret.",
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(userModel.createStrategy());

passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


app.get("/", function (req, res) {
    res.redirect("/dashboard");
})


app.get("/users", async (request, response) => {
    const users = await userModel.find({});

    try {
        response.send(users);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.get("/dashboard", async function (req, res) {

    if (req.isAuthenticated()) {
        const products = await productModel.find({ user_id: req.user._id }).sort({ "updatedAt": -1 });
        //res.send(req.user);
        res.render("dashboard", { user: req.user, products: products, moment: moment,ipAddress: systemIP });

    }
    else {
        res.redirect("/login");
    }
})

app.get("/register", function (req, res) {
    res.render("register",{ipAddress: systemIP})
})

app.post("/register", function (req, res) {
    userModel.register({
        username: req.body.username,
        email: req.body.email
    }, req.body.password,
        function (err, user) {
            if (err) {
                console.log(err);
                res.send("Not DOne")
            }
            else {
                passport.authenticate("local")(req, res, function () {
                    res.redirect("/dashboard")
                });
            }
        })
})



app.patch("/user/:id", async (request, response) => {
    try {
        await userModel.findByIdAndUpdate(request.params.id, { $set: request.body });
        await userModel.save();
        response.send(user);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.delete("/user/:id", async (request, response) => {
    try {
        const user = await userModel.findByIdAndDelete(request.params.id);

        if (!user) response.status(404).send("No item found");
        response.status(200).send();
    } catch (error) {
        response.status(500).send(error);
    }
});
//////////////////////////

app.get("/login", function (req, res) {
    res.render("login",{ipAddress: systemIP})
})

app.post("/login", function (req, res) {
    const user = new userModel({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            passport.authenticate("local")(req, res, function () {
                //console.log(req.user);
                res.redirect("/dashboard");
            });
        }
    })
});

//Handling user logout 
app.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect("/login");
    });
});




//////////////////////////
app.get("/products", async (request, response) => {
    const products = await productModel.find({});

    try {
        response.send(products);
    } catch (error) {
        response.status(500).send(error);
    }
});
app.post("/product", async (request, response) => {
    console.log(request.body);
    const product = new productModel(request.body);

    console.log(request.files);
    if (request.files) {
        let file = request.files.testImage;
        let filename = file.name;

        let buff = new Buffer.from(request.files.testImage.data, 'base64');

        //product.image.data = request.body.testImage;
        //product.image.contentType = 'image/png';
        let imagename = request.body.name + Date.now();

        let picuri = './public/data/' + imagename + filename;
        product.image = imagename + filename;
        fs.writeFileSync(picuri, buff);
    }


    try {
        await product.save();

        response.redirect("/dashboard");
    } catch (error) {
        response.status(500).send(error);
    }

});

app.post("/product/addImage", async (req, res) => {
    const product = await productModel.findById(req.body.id);
    // console.log(req.files)
    if (req.files) {
        let file = req.files.testImage;
        let filename = file.name;

        let buff = new Buffer.from(req.files.testImage.data, 'base64');

        //product.image.data = request.body.testImage;
        //product.image.contentType = 'image/png';
        let imagename = product.name + Date.now();

        let picuri = './public/data/' + imagename + filename;
        product.image = imagename + filename;
        fs.writeFileSync(picuri, buff);
        product.save();
        res.redirect('/product/' + req.body.id)
    }

})
app.post("/product/deleteImage", async (req, res) => {
    const product = await productModel.findById(req.body.id);
    // console.log(req.files)




    //product.image.data = request.body.testImage;
    //product.image.contentType = 'image/png';

    let picuri = './public/data/' + product.image;
    product.image = null;
    product.save();

    fs.unlink(picuri, (err) => {
        if (err) {
            console.log(err);
        }
        else {
        }
    });
    res.redirect('/product/' + req.body.id)




})
app.post("/productdetails", async (request, response) => {
    const id = request.body.id;
    try {
        const product = await productModel.findById(id);
        if (!product) { response.status(404).send("No item found") }
        else {
            const user = await userModel.findById(product.user_id);
            if ((product.image.substr(product.image.length - 4)).toLowerCase() == 'gltf' || (product.image.substr(product.image.length - 4)).toLowerCase() == '.glb') {
                console.log("yes");
                product.type = 'gltf';
            }
            response.render('viewProductDetails', { product: product, user: user, moment: moment })
        }
    } catch (e) {
        console.log(e);
    }

})

app.post("/product/reviews/:id", async (request, response) => {
    const id = request.params.id;
    if (request.isAuthenticated()) {
        try {
            const product = await productModel.findById(id);
            if (!product) { response.status(404).send("No item found") }
            else {
                const rateProduct = await productModel.findByIdAndUpdate(
                    id, {
                    $push: {
                        ratings: {
                            star: 5,
                            review: request.body.review,
                            postedby: request.user._id,
                            reviewer: request.user.username
                        }
                    }
                }, {
                    new: true
                }
                );
                response.redirect("/product/reviews/" + id);
            }
        } catch (e) {
            console.log(e);
        }
    }
})
app.get("/product/reviews/:id", async (request, response) => {
    const id = request.params.id;
    try {
        const product = await productModel.findById(id);
        if (!product) { response.status(404).send("No item found") }
        else {


            if (request.isAuthenticated()) {


                //response.send(product);
                if (product.user_id.equals(request.user._id)) {

                    response.render('owner-reviews', { product: product, user: request.user, moment: moment })




                }
                else {

                    const user = await userModel.findById(product.user_id);
                    response.render('user-reviews', { product: product, user: user, moment: moment })




                }
            }
            else {
                const user = await userModel.findById(product.user_id);
                response.render('reviews', { product: product, user: user, moment: moment })

            }
        }

    } catch (e) {
        console.error(e)
    }
});

app.get("/product/:id", async (request, response) => {
    const id = request.params.id;
    try {
        const product = await productModel.findById(id);
        if (!product) { response.status(404).send("No item found") }
        else {


            if (request.isAuthenticated()) {


                //response.send(product);
                if (product.user_id.equals(request.user._id)) {
                    qr.toDataURL("https://"+systemIP+":3000/product/" + request.params.id, function (err, code) {
                        if (err) return response.send(err);
                        if (product.image) {

                            if ((product.image.substr(product.image.length - 4)).toLowerCase() == 'gltf' || (product.image.substr(product.image.length - 4)).toLowerCase() == '.glb') {
                                console.log("yes");
                                product.type = 'gltf';
                            }
                            //.glb
                        }
                        response.render('editProduct', { product: product, user: request.user, moment: moment, code: code,ipAddress: systemIP  })
                    })



                }
                else {
                    console.log(product.image);

                    if (product.password == null) {
                        const user = await userModel.findById(product.user_id);
                        if ((product.image.substr(product.image.length - 4)).toLowerCase() == 'gltf' || (product.image.substr(product.image.length - 4)).toLowerCase() == '.glb') {
                            //view Model
                            console.log(product.image);
                            response.render('viewProductModel', { product: product, user: user, moment: moment })
                        }
                        else {
                            response.render('viewProduct', { product: product, user: user, moment: moment })
                        }

                    }
                    else {
                        if (product.password == '') {
                            const user = await userModel.findById(product.user_id);
                            if ((product.image.substr(product.image.length - 4)).toLowerCase() == 'gltf' || (product.image.substr(product.image.length - 4)).toLowerCase() == '.glb') {
                                //view Model
                                console.log(product.image);

                                response.render('viewProductModel', { product: product, user: user, moment: moment })
                            }
                            else {
                                response.render('viewProduct', { product: product, user: user, moment: moment })
                            }
                        }
                        else {
                            response.render('productPassword', { id: product._id })

                        }
                    }


                }
            }
            else {
                console.log(product.image);

                if (product.password == null) {
                    const user = await userModel.findById(product.user_id);
                    if ((product.image.substr(product.image.length - 4)).toLowerCase() == 'gltf' || (product.image.substr(product.image.length - 4)).toLowerCase() == '.glb') {
                        //view Model
                        console.log(product.image);
                        response.render('viewProductModel', { product: product, user: user, moment: moment })
                    }
                    else {
                        response.render('viewProduct', { product: product, user: user, moment: moment })
                    }

                }
                else {
                    if (product.password == '') {
                        const user = await userModel.findById(product.user_id);
                        if ((product.image.substr(product.image.length - 4)).toLowerCase() == 'gltf' || (product.image.substr(product.image.length - 4)).toLowerCase() == '.glb') {
                            //view Model
                            console.log(product.image);

                            response.render('viewProductModel', { product: product, user: user, moment: moment })
                        }
                        else {
                            response.render('viewProduct', { product: product, user: user, moment: moment })
                        }
                    }
                    else {
                        response.render('productPassword', { id: product._id })

                    }
                }


            }
        }

    } catch (e) {
        console.error(e)
    }

});

app.post("/product/password", async (req, res) => {
    // console.log(req.body);
    const product = await productModel.findById(req.body.id);
    if (product.password == req.body.password) {
        const user = userModel.findById(product.user_id);
        res.render('viewProduct', { product: product, user: user, moment: moment, ipAddress: systemIP })
    }
    else {
        res.send("Unauthorized");
    }

});

app.post("/product/:id", async function (req, res) {
    if (req.isAuthenticated()) {
        const product = await productModel.findOne({ _id: req.params.id });

        if (!product) res.status(404).send("No item found");

        //response.send(product);
        if (product.user_id.equals(req.user._id)) {
            await productModel.findByIdAndUpdate(req.params.id, { $set: req.body });
            return res.redirect("/dashboard");
        }
        else {
            res.redirect("/logout");
        }
    }
    else {
        res.redirect("/login");
    }
});

app.get("/product/delete/:id", async function (req, res) {
    if (req.isAuthenticated()) {
        const product = await productModel.findOne({ _id: req.params.id });

        if (!product) res.status(404).send("No item found");



        //response.send(product);
        if (product.user_id.equals(req.user._id)) {
            let picuri = './public/data/' + product.image;


            fs.unlink(picuri, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                }
            });
            await productModel.findByIdAndDelete(req.params.id);
            return res.redirect("/dashboard");
        }
        else {
            res.redirect("/logout");
        }
    }
    else {
        res.redirect("/login");
    }
});



app.get("/viewModel/:model", async (request, response) => {

    response.render('viewModel', { model: request.params.model })
});



module.exports = app;