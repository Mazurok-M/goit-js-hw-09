import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

import Notiflix from 'notiflix';

const refs = {
  startButton: document.querySelector('button[data-start]'),
  daysEl: document.querySelector('span[data-days]'),
  hoursEl: document.querySelector('span[data-hours]'),
  minutesEl: document.querySelector('span[data-minutes]'),
  secondsEl: document.querySelector('span[data-seconds]'),
};

refs.startButton.setAttribute('disabled', true);

let selectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (Date.now() > selectedDates[0]) {
      Notiflix.Notify.failure('Please choose a date in the future');
      refs.startButton.setAttribute('disabled', true);
    } else {
      refs.startButton.removeAttribute('disabled');
    }
    selectedDate = selectedDates[0];
  },
};

flatpickr('input#datetime-picker', options);

class Timer {
  constructor({ onTimer }) {
    this.intervalId = null;
    this.onTimer = onTimer;
  }

  start() {
    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const remainingTime = selectedDate - currentTime;
      const time = this.convertMs(remainingTime);
      this.onTimer(time);

      refs.startButton.setAttribute('disabled', true);
      if (remainingTime < 1000) {
        this.stop();
      }
    }, 1000);
  }

  stop() {
    clearInterval(this.intervalId);
  }

  convertMs(ms) {
    // Number of milliseconds per unit of time
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    // Remaining days
    const days = this.addLeadingZero(Math.floor(ms / day));
    // Remaining hours
    const hours = this.addLeadingZero(Math.floor((ms % day) / hour));
    // Remaining minutes
    const minutes = this.addLeadingZero(
      Math.floor(((ms % day) % hour) / minute)
    );
    // Remaining seconds
    const seconds = this.addLeadingZero(
      Math.floor((((ms % day) % hour) % minute) / second)
    );

    return { days, hours, minutes, seconds };
  }

  addLeadingZero(value) {
    return String(value).padStart(2, '0');
  }
}

const timer = new Timer({
  onTimer: updateClockFace,
});

refs.startButton.addEventListener('click', timer.start.bind(timer));

function updateClockFace({ days, hours, minutes, seconds }) {
  refs.daysEl.textContent = days;
  refs.hoursEl.textContent = hours;
  refs.minutesEl.textContent = minutes;
  refs.secondsEl.textContent = seconds;
}
