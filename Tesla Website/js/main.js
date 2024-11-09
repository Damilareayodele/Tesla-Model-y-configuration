const topBar = document.getElementById('top-bar');
const exteriorColorSelector = document.querySelector('#exterior-buttons');
const interiorColorSelector = document.querySelector('#interior-buttons');
const exteriorImage = document.querySelector('#exterior-image');
const interiorImage = document.querySelector('#interior-image');
const wheelSelector = document.querySelector('#wheel-buttons');
const performanceButton = document.querySelector('#performance-btn');
const totalPrice = document.querySelector('#total-price');
const fullSelfDriving = document.querySelector('#self-driving-checkbox');
const accessoryCheckboxes = document.querySelectorAll(
  '.accessory-form-checkbox'
);
const downPaymentEl = document.querySelector('#down-payment');
const monthlyPaymentEl = document.querySelector('#monthly-payment');

const basePrice = 52490;
let currentPrice = basePrice;

let selectedColor = 'Stealth Grey';

const selectedOption = {
  'Performance Wheels': false,
  'Performance Package': false,
  'Full Self-Driving': false,
};

// Pricing

const pricing = {
  'Performance Wheels': 2500,
  'Full Self-Driving': 8500,
  'Performance Package': 5000,
  Accessories: {
    'Center Console Trays': 35,
    'All-Weather Interior Liners': 225,
    Sunshade: 105,
  },
};

// Update the total price in the ui
const updateTotalPrice = () => {
  //Reset the current price to the base Price
  currentPrice = basePrice;

  if (selectedOption['Performance Wheels']) {
    currentPrice += pricing['Performance Wheels'];
  }

  if (selectedOption['Performance Package']) {
    currentPrice += pricing['Performance Package'];
  }

  if (selectedOption['Full Self-Driving']) {
    currentPrice += pricing['Full Self-Driving'];
  }
  accessoryCheckboxes.forEach((box) => {
    const accessoryLabel = box
      .closest('label')
      .querySelector('span')
      .textContent.trim();
    const accessoryPrice = pricing['Accessories'][accessoryLabel];
    if (box.checked) {
      currentPrice += accessoryPrice;
    }
  });
  handleDownpayment();

  // Update the total price in the ui
  totalPrice.textContent = `$${currentPrice.toLocaleString()}`;
};

// Handle down Payment
const handleDownpayment = () => {
  const downPayment = currentPrice / 10;
  downPaymentEl.textContent = `$${downPayment.toLocaleString()}`;

  const loanTermMonths = 60;
  const interestRate = 0.03;
  const loanAmount = currentPrice - downPayment;

  const monthlyInterestRate = interestRate / 12;
  const monthlyPayment =
    (loanAmount *
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, loanTermMonths))) /
    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

  monthlyPaymentEl.textContent = `$${monthlyPayment
    .toFixed(2)
    .toLocaleString()}`;
};

// Image Mapping
const exteriorImages = {
  'Stealth Grey': './images/model-y-stealth-grey.jpg',
  'Pearl White': './images/model-y-pearl-white.jpg',
  'Deep Blue': './images/model-y-deep-blue-metallic.jpg',
  'Solid Black': './images/model-y-solid-black.jpg',
  'Ultra Red': './images/model-y-ultra-red.jpg',
  Quicksilver: './images/model-y-quicksilver.jpg',
};

const interiorImages = {
  Dark: './images/model-y-interior-dark.jpg',
  Light: './images/model-y-interior-light.jpg',
};

// functions
// top bar Handler
const handleScroll = () => {
  const atTop = window.scrollY === 0;
  topBar.classList.toggle('visible-bar', atTop);
  topBar.classList.toggle('hidden-bar', !atTop);
};

// Handle Color Selections
const handleColorChange = (e) => {
  let button;
  if (e.target.tagName === 'IMG') {
    button = e.target.closest('button');
  } else if (e.target.tagName === 'BUTTON') {
    button = e.target;
  }

  if (button) {
    const buttons = e.currentTarget.querySelectorAll('button');
    buttons.forEach((btn) => btn.classList.remove('btn-selected'));
    button.classList.add('btn-selected');

    // Change exterior color
    if (e.currentTarget === exteriorColorSelector) {
      selectedColor = button.querySelector('img').alt;
      updateExteriorImage();
    }
    // Change Interior color
    if (e.currentTarget === interiorColorSelector) {
      const color = button.querySelector('img').alt;
      interiorImage.src = interiorImages[color];
    }
  }
};
// Update exterior color on wheel change
const updateExteriorImage = () => {
  const perforanceSuffix = selectedOption['Performance Wheels']
    ? '-performance'
    : '';
  const colorKey =
    selectedColor in exteriorImages ? selectedColor : 'Stealth Grey';
  exteriorImage.src = exteriorImages[colorKey].replace(
    '.jpg',
    `${perforanceSuffix}.jpg`
  );
};

// Handle wheel buttons
const handleWheelButtons = (e) => {
  if (e.target.tagName === 'BUTTON') {
    const button = document.querySelectorAll('#wheel-buttons button');
    button.forEach((btn) => btn.classList.remove('bg-gray-700', 'text-white'));

    // Add styles to the clicked button
    e.target.classList.add('bg-gray-700', 'text-white');

    selectedOption['Performance Wheels'] =
      e.target.textContent.includes('Performance');

    updateExteriorImage();
    updateTotalPrice();
  }
};

const handlePerformanceButton = () => {
  const isSelected = performanceButton.classList.toggle('bg-gray-700');
  performanceButton.classList.toggle('text-white');

  selectedOption['Performance Package'] = isSelected;
  updateTotalPrice();
};

// Full Self driving Selection
const fullSelfDrivingCheckbox = () => {
  const isSelected = fullSelfDriving.checked;
  selectedOption['Full Self-Driving'] = isSelected;
  updateTotalPrice();
};

// Handle Accessories Checkboxes

accessoryCheckboxes.forEach((box) =>
  box.addEventListener('change', () => updateTotalPrice())
);
updateTotalPrice();

// Event Listeners
window.addEventListener('scroll', () => requestAnimationFrame(handleScroll));
exteriorColorSelector.addEventListener('click', handleColorChange);
interiorColorSelector.addEventListener('click', handleColorChange);
wheelSelector.addEventListener('click', handleWheelButtons);
performanceButton.addEventListener('click', handlePerformanceButton);
fullSelfDriving.addEventListener('change', fullSelfDrivingCheckbox);
