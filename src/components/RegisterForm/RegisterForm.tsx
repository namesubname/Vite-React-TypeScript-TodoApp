import React, { useState } from "react";
import styles from "./RegisterForm.module.css"


interface UserData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegisterFormProps {
  onNavigate: () => void;
}

function RegisterForm({ onNavigate }: RegisterFormProps) {
  const [formData, setFormData] = useState<UserData>({ email: '', password: '', confirmPassword: '' })

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (formData.password != formData.confirmPassword) {
      alert("Пароли не совпадают!")
      return
    }


    fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      }),
    })
      .then(async (response) => {
        const data = await response.json();

        if (response.ok) {
          alert(data.message); // Выведет "Пользователь успешно зарегистрирован"

          setFormData({ email: '', password: '', confirmPassword: '' });
        }

        else {
          alert(data.error || "Произошла ошибка при регистрации");
        }
      })
      .catch((error) => {
        console.error("Ошибка сети:", error);
        alert("Не удалось связаться с сервером бэкенда");
      });


    console.log("Данные готовы к отправке во Flask", formData)
  }

  return (
    <>
      <div className={styles.pageWrapper}>
        <h4>Регистрация</h4>
        <form className={styles.formContainer} onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" required className={`${styles.formInput} ${styles.inputEmail}`} name="email" value={formData.email} onChange={handleChange} />

          <input type="password" placeholder="Password" required className={`${styles.formInput} ${styles.inputPassword}`} name="password" value={formData.password} onChange={handleChange} />

          <input type="password" placeholder="Confirm Password" required className={`${styles.formInput} ${styles.inputConfirmPassword}`} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />

          <button type="submit" className={styles.submitButton}>Отправить</button>
          <p className={styles.switchText}>
            Уже есть аккаунт?{' '}
            <span className={styles.switchLink} onClick={onNavigate}>
              Войти
            </span>
          </p>
        </form>
      </div>
    </>
  )
}

export default RegisterForm
