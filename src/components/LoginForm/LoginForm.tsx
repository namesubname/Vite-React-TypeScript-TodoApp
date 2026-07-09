import React, { useState } from "react"
import styles from "./LoginForm.module.css"

interface UserData {
  login: string;
  password: string;
}

interface LoginFormProps {
  onNavigate: () => void;
}

function LoginForm({ onNavigate }: LoginFormProps) {
  const [formData, setFormData] = useState<UserData>({ login: '', password: '' })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    console.log("Данные готовы к отправке во Flask", formData)

    fetch('http://127.0.0.1:5001/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: formData.login,
        password: formData.password
      }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (response.ok) {
          alert(`${data.message} Добро пожаловать, ${data.user.username}!`);

        } else {
          alert(data.error || "Ошибка авторизации");
        }
      })
      .catch((error) => {
        console.error("Ошибка сети:", error);
        alert("Не удалось связаться с сервером бэкенда");
      });
  }

  return (
    <>
      <div className={styles.pageWrapper}>
        <h4>Авторизация</h4>
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <input type="text" placeholder="Email or Login" required className={`${styles.formInput} ${styles.inputLogin}`} name="login" onChange={handleChange} />

          <input type="password" placeholder="Password" required className={`${styles.formInput} ${styles.inputPassword}`} name="password" onChange={handleChange} />

          <button type="submit" className={styles.submitButton}>Отправить</button>
          <p className={styles.switchText}>
            Нет аккаунта?{' '}
            <span className={styles.switchLink} onClick={onNavigate}>
              Зарегистрироваться
            </span>
          </p>
        </form>
      </div >
    </>
  )
}

export default LoginForm
