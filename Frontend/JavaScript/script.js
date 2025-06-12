// Add interactivity (e.g., toggle active menu item)
const menuItems = document.querySelectorAll('.menu li a');

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    // Remove active class from all items
    menuItems.forEach(link => link.classList.remove('active'));
    // Add active class to the clicked item
    item.classList.add('active');
  });
});