# MyTasks 

MyTasks is a simple, modern, and mobile-responsive To-Do web app built with **HTML, CSS, and JavaScript**. It helps you keep track of tasks, mark them as complete, edit or delete them, and save your data locally in your browser.  

## Live Demo

You can view the app live here: [MyTasks on Netlify](https://app.netlify.com/projects/phenomenal-tapioca-79960b/deploys)

## Features  

- **Persistent storage** with `localStorage` (data remains after closing the browser).  
- **User personalization**:  
  - On first load, the app prompts for your name in a modal.  
  - Your name is saved in `localStorage` and shown in the navigation bar.  
  - A reset button allows you to clear all stored data (including your name) after confirmation.  
- **Task management**:  
  - Add tasks with an optional deadline/date.  
  - Edit tasks inline using a prompt.  
  - Delete tasks when no longer needed.  
  - Mark tasks as completed with a checkbox (applies strikethrough style).  
- **Sorting and filtering**: Ability to view tasks based on completion status or deadlines.  
- **Responsive design**: Works seamlessly on both desktop and mobile devices.  
- **Modern UI/UX**: Clean layout with a simple and intuitive interface.  

## Installation & Usage  

1. Clone or download the repository.  
2. Open `index.html` in any modern web browser (Chrome, Firefox, Edge, Safari).  
   - No extra setup or server is required.  

## File Structure  

```plaintext
mytasks/
├── index.html   # Main HTML file
├── style.css    # Styling
└── script.js    # JavaScript functionality
```

## Reset Functionality  

- The **Reset button** in the navigation bar clears all data stored in `localStorage`.  
- You’ll be prompted with a confirmation alert before the reset happens.  

## License  

This project is licensed under the **MIT License**. You are free to use, modify, and distribute it.  
