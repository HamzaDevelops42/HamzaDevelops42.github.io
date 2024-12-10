AOS.init({
    duration: 1000, // Animation duration in milliseconds
    easing: 'ease-in-out', // Animation easing
    once: true, // Whether animation should happen only once
  });


const goUpButton = document.querySelector('.go-up');

const toggleGoUpButton = () => {
    if (window.scrollY > 1300) { 
        goUpButton.classList.add('show');
        goUpButton.classList.remove('hide');
    } else {
        goUpButton.classList.add('hide');
        goUpButton.classList.remove('show');
    }
};

goUpButton.addEventListener('click', (e) => {
    e.preventDefault(); 
    window.scrollTo({
        top: 0,
        behavior: 'smooth' 
    });
});

document.addEventListener('DOMContentLoaded', toggleGoUpButton);


window.addEventListener('scroll', toggleGoUpButton);

