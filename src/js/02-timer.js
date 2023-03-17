import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const refs = {
  startBtn: document.querySelector('button[data-start]'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  minutes: document.querySelector('span[data-minutes]'),
  seconds: document.querySelector('span[ data-seconds]'),
}

//в зміні: обрану дату, різницю для таймера
// та зміннy для припинення роботи інтервалу
let selectedDate = 0;
let deltaTime = 0;
let intervalId = null;

refs.startBtn.disabled = true;

refs.startBtn.addEventListener('click', onStartBtnClick);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDate = selectedDates[0]; //обраній даті присвоїти 1 позицію в масиві
     
    if (selectedDate <= new Date()) { // перевіряю, якщо обрана дата в минул - попередження
      showWarning();
      return;
    }
    refs.startBtn.disabled = false; // якщо дата в майб, то активую кнопку
  }
};

const fpicker = flatpickr('#datetime-picker', options);

function onStartBtnClick(e) {
  // в об'єкті options вже є перевірка чи дата в майбутньому,
  // тому по кліку відключаю кнопку
  refs.startBtn.disabled = true;
  // вимикаю 'вибір' в календарі
  fpicker.destroy();
  // і запускаю- відмалювати інтерфейс таймера
  intervalId = setInterval(timerCount, 1000);
}

function timerCount() {
  deltaTime = selectedDate - new Date(); 

  //якщо різниця менш за 1с, очистити інтервал
  if (deltaTime <= 1000) {
    clearInterval(intervalId);
  }
  updateDial(deltaTime);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function updateDial(time) {
  const { days, hours, minutes, seconds } = convertMs(time);

  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function showWarning() {
  Notify.failure('Вітання з минулого ^_-/. Оберіть, будь ласка, дату в майбутньому', {
    timeout: 3000,
  });
}