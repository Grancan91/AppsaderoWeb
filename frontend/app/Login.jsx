"use client";

import React from "react";

import {
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

import { auth } from "../services/firebase";

export default function Login() {

  const provider = new GoogleAuthProvider();

  async function loginGoogle() {
    try {

      const result = await signInWithPopup(auth, provider);

      console.log(result.user);

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="login-page">

      <h1>Login</h1>

      <label>
        Usuario
        <input type="text" name="username" placeholder="Usuario" />
      </label>

      <label>
        Contraseña
        <input type="password" name="password" placeholder="Contraseña" />
      </label>

      <button onClick={loginGoogle}>
        Ingresar con Google
      </button>

    </main>
  );
}