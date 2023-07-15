//1.. Invocar a express
const express = require("express");
const app = express();

//2. seteamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//3. Invocar a dotev
const dotenv = require("dotenv");
dotenv.config({ path: "./env/.env" });

//4. el directorio public
app.use("/resources", express.static("public"));
app.use("/resources", express.static(__dirname + "/public"));

//5.Establecer el motor deplantilla
app.set("view engine", "ejs");

//6.Invocamos a bcryptjs
const bcryptjs = require("bcryptjs");

//7. var de session
const session = require("express-session");
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//8. Invocamos al modulo de conexion de la base de datos
const connection = require("./database/db");

//9. Estableciendo las rutas
app.get("/login", (req, res) => {
  res.render("login.ejs");
});
app.get("/register", (req, res) => {
  res.render("register.ejs");
});

// 10. Registracion
app.post("/register", async (req, res) => {
  const user = req.body.user;
  const name = req.body.name;
  const rol = req.body.rol;
  const pass = req.body.pass;
  let passwordHaash = await bcryptjs.hash(pass, 8);
  connection.query(
    'INSERT INTO users SET ?',{ user: user, name: name, rol: rol, pass: passwordHaash },async (error, results) => {
      if (error) {
        console.log(error);
      } else {
        res.render('register', {
          alert: true,
          alertTitle: "Registration",
          alertMessage: "!Succesfull Registration",
          alertIcon: "success",
          showConfirmButton: false,
          timer: 1500,
          ruta: 'login',
        });
      }
    }
  );
});

//11. Autenticacion
app.post("/auth", async (req, res) => {
  const user = req.body.user; //capturamos el valor ingresado en user
  const pass = req.body.pass;
  let passwordHaash = await bcryptjs.hash(pass, 8);
  if (user && pass) {
    connection.query(
      'SELECT * FROM users WHERE user = ?', [user], async (error, results) => {
        if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
          res.render('login', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Usuario y/o password incorrectas",
            alertIcon: "error",
            showConfirmButton: true,
            timer: false,
            ruta:'login'
          });
        } else {
          req.session.loggedin = true;
          req.session.name = results[0].name;
          res.render('login', {
            alert: true,
            alertTitle: "Conexión Exitosa",
            alertMessage: "¡LOGIN CORRECTO!",
            alertIcon: "success",
            showConfirmButton: false,
            timer: 1500,
            ruta: '',
          });
        }
      }
    );
  } else {
    res.render('login', {
      alert: true,
      alertTitle: "Advertencia",
      alertMessage: "¡Por favor ingrese un usuario y/o contraseña!",
      alertIcon: "warning",
      showConfirmButton: true,
      timer: false,
      ruta: 'login',
    });
  }
});

//12. Auth pages
app.get('/',(req,res)=>{
  if(req.session.loggedin){
    res.render('index',{
      login:true,
      name: req.session.name
    })
  }else{
    res.render('index',{
      login: false,
      name:'Debe iniciar sesion'
    })
  }
})

//13.Logout
app.get('/logout',(req,res)=>{
  req.session.destroy(()=>{
    res.redirect('/')
  })
})
// app.get('/',(req,res)=>{
//     res.send('HOLA MUNDO!!!');
// })
app.listen(3000, (req, res) => {
  console.log("SERVER RUNNING IN http://localhost:3000");
});
