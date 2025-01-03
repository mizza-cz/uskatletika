const months = [
  'Leden',
  'Únor',
  'Březen',
  'Duben',
  'Květen',
  'Červen',
  'Červenec',
  'Srpen',
  'Září',
  'Říjen',
  'Listopad',
  'Prosinec',
];

// query selector
const eventsContainer = document.querySelector('#events-container');
const eventsCalendar = document.querySelector('#events-calendar');
const events = document.querySelector('#events');
const prevMonthButton = document.querySelector('#events-prev-month');
const nextMonthButton = document.querySelector('#events-next-month');

// global variables
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

// functions
function formatDate(dateString, boolDay = false) {
  if (!dateString) return '';
  const date = new Date(dateString);

  const day = date.getDate();

  if (boolDay) return day;

  const month = date.getMonth();
  const year = date.getFullYear();

  return `${day}. ${month + 1}. ${year}`;
}

function displayMonthYear() {
  const monthYearElement = document.querySelector('#month-year');
  monthYearElement.innerHTML = `${months[currentMonth]} ${currentYear}`;
}

function getPrevMonth() {
  currentMonth--;

  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }

  fetchEvents();
}

function getNextMonth() {
  currentMonth++;

  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }

  fetchEvents();
}

function findEvent(event, loopDate) {
  const [year, month, day] = event.date.split('-');
  const date = new Date(year, month - 1, day).getDate();

  return date === loopDate;
}

function displayDaysInMonth(data) {
  const daysCount = new Date(currentYear, currentMonth + 1, 0).getDate();
  let firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  // Sunday
  if (firstDayOfMonth === 0) {
    firstDayOfMonth = 7;
  }

  let calendarDaysHTML = '';

  for (let i = 0; i < firstDayOfMonth - 1; ++i) {
    calendarDaysHTML += `
            <li>
                <button id="event-button" class="cursor-not-allowed">
                    <span>MM</span>
                </button>
            </li>
        `;
  }

  for (let i = 1; i <= daysCount; ++i) {
    const dateWithEvent = data.find((event) => findEvent(event, i));

    calendarDaysHTML += `
            <li>
                <button id="event-button" data-date="${i}" ${
      dateWithEvent ? 'data-highlighted' : ''
    }>
                    <span>${i}</span>
                </button>
            </li>
        `;
  }

  eventsCalendar.innerHTML = calendarDaysHTML;
}

function displayEvents(data) {
  let eventsHTML = '';

  for (const event of data) {
    eventsHTML += `
            <li id="event-${formatDate(event.date, true)}">
                <a href="${event.url}" class="group events-row">
                    <time class="mb-1 events-row__date" datetime="${event.date} ${
      event.time
    }">${formatDate(event.date)}, ${event.time}</time>
                    <h3 class="mb-2">${event.name}</h3>
                </a>
            </li>
        `;
  }

  events.innerHTML = eventsHTML;
}

function clickEventButtonHandler(button) {
  if (!button.hasAttribute('data-highlighted')) return;

  const oldSelectedEvents = document.querySelectorAll('.events-row.selected');

  for (const event of oldSelectedEvents) {
    event.classList.remove('selected');
  }

  const selectedEvents = document.querySelectorAll(`#event-${button.dataset.date}`);

  for (const event of selectedEvents) {
    event.firstElementChild.classList.add('selected');
  }

  selectedEvents[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
}

async function fetchEvents() {
  const spinner = document.createElement('div');
  spinner.setAttribute('role', 'status');
  spinner.innerHTML = `       
            <svg aria-hidden="true" class="spinner" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span class="sr-only">Načítání...</span>
        `;
  eventsContainer.prepend(spinner);

  const response = await fetch(
    `${eventsContainer.dataset.source}?month=${currentMonth + 1}&year=${currentYear}`,
    { method: 'GET' },
  );
  if (response.ok) {
    const data = await response.json();
    if (data) {
      displayDaysInMonth(data);
      displayEvents(data);

      const eventButtons = document.querySelectorAll('#event-button');
      for (const button of eventButtons) {
        button.addEventListener('click', (e) => clickEventButtonHandler(e.target));
      }

      spinner.remove();
    }
  }

  displayMonthYear();
}

prevMonthButton.addEventListener('click', getPrevMonth);
nextMonthButton.addEventListener('click', getNextMonth);

fetchEvents();
