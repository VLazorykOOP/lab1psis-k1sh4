document.addEventListener("DOMContentLoaded", () => {
  // Шукаємо форму за ID
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Зупиняємо перезавантаження сторінки

      // Збираємо дані
      const formData = new FormData(contactForm);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      };

      try {
        // Відправляємо на сервер
        const response = await fetch("/api/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          alert("Дякуємо! Ваше повідомлення відправлено.");
          contactForm.reset();
        } else {
          alert("Щось пішло не так. Спробуйте пізніше.");
        }
      } catch (error) {
        console.error("Помилка:", error);
        alert("Помилка з'єднання.");
      }
    });
  }
});
