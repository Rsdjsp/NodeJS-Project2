const Users = require("./users");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require("../config");
const bcrypt = require("bcrypt");
const sendEmail = require("../libs/email");
const { email_redirect_url } = require("../config");

class Auth {
  constructor() {
    this.users = new Users();
  }

  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }

  getToken(user) {
    const data = {
      id: user.id,
      name: user.firstName,
      birthday: user.birthday,
      displayName: user.displayName,
      email: user.email,
      role: user.role ? user.role : 0,
      validateUser: user.validateUser ? user.validateUser : false,
    };
    const token = jwt.sign(data, jwt_secret, { expiresIn: "1d" });
    return { success: true, data, token };
  }

  async login(email, password) {
    const user = await this.users.getByEmail(email);
    if (!email || !password) {
      return { success: false, message: "Ingresa credenciales" };
    }
    if (user) {
      const correctPassword = await bcrypt.compare(password, user.password);
      if (correctPassword) {
        return this.getToken(user);
      }
    }

    return { success: false, message: "Las credenciales no coinciden" };
  }

  async signup(userData) {
    if (await this.users.getByEmail(userData.email)) {
      return { succes: false, message: "Usuario ya registrado" };
    } else {
      userData.password = await this.hashPassword(userData.password);
      const user = await this.users.create(userData);
      const userToken = jwt.sign(userData, jwt_secret, { expiresIn: "1d" });
      await sendEmail(
        userData.email,
        "Registro exitoso",
        "Bienvenido a la aplicación",
        `<div><h1><em>Bienvenido</em> a la aplicación</h1><br/><a href="${email_redirect_url}/${userData.email}/${userToken}"><button >Verify Email</button></a><br/><p>this links expires in 24 hours</p></div>`
      );
      return this.getToken(user);
    }
  }

  async loginProvider(profile) {
    let user = await this.users.getByEmail(profile.email);
    if (!user) {
      user = await this.users.create({
        name: profile.name?.givenName + "" + profile.name?.familyName,
        email: profile.emails ? profile.emails[0].value : undefined,
        displayname: profile.displayname ? profile.displayname : undefined,
        role: 0,
        provider: profile.provider,
        idProvider: profile.id,
        validateUser: profile.validateUser,
      });
    }
    return this.getToken(user);
  }

  async validateUser(email, userToken) {
    if (!userToken) {
      return { success: false, message: "token expired" };
    } else {
      const user = await this.users.getByEmail(email);
      user.validateUser = true;
      await this.users.update(user._id, user);
      return { success: true, message: "user active" };
    }
  }
}

module.exports = Auth;
