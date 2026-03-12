document.addEventListener('DOMContentLoaded', () => {
  const appointmentForm = document.getElementById('appointmentForm');
  const formMessage = document.getElementById('formMessage');

  if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Reset message
      formMessage.textContent = 'Processing...';
      formMessage.className = 'form-message';

      const formData = new FormData(appointmentForm);
      const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        service: formData.get('service'),
        date: formData.get('date'),
        time: formData.get('time'),
        notes: formData.get('notes')
      };

      try {
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
          formMessage.textContent = result.message || 'Appointment booked successfully!';
          formMessage.classList.add('success');
          appointmentForm.reset();
        } else {
          formMessage.textContent = result.message || 'Something went wrong. Please try again.';
          formMessage.classList.add('error');
        }
      } catch (error) {
        formMessage.textContent = 'Error connecting to the server. Please check if the server is running.';
        formMessage.classList.add('error');
      }
    });
  }

  // Set minimum date for appointment to today
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
});
