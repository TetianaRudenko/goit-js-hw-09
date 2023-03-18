/* function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;
  if (shouldResolve) {
    // Fulfill
  } else {
    // Reject
  }
} */


import { Notify } from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector('.form');
form.addEventListener('submit', onFormSubmit);


function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(`💙💛 ✔️ Fulfilled promise ${position} in ${delay}ms`);
      }
      reject(`⛔️ Rejected promise ${position} in ${delay}ms`);
    }, delay);
  });

}


function onFormSubmit(e) {
  e.preventDefault();

  let DELAY = Number(form.delay.value);
  const DELAY_STEP = Number(form.step.value);
  const AMOUNT = Number(form.amount.value);

  for (let i = 1; i <= AMOUNT; i += 1) {
    createPromise(i, DELAY)
      .then(result => Notify.success(result))
      .catch(error => Notify.failure(error));
    DELAY += DELAY_STEP;
  }
}


