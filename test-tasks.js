// Test tasks functionality
async function testTasks() {
  try {
    console.log('Testing tasks...');
    
    const response = await fetch('http://localhost:3000/api/tasks');
    const tasks = await response.json();
    
    console.log('Tasks found:', tasks.length);
    tasks.forEach((task, index) => {
      console.log(`Task ${index + 1}:`, {
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        category: task.category
      });
    });
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testTasks();


